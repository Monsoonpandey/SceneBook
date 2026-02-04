import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    setDoc,
} from "firebase/firestore";

import { db } from "../config/Firebase";

// EMPTY - We use TMDB API for movies
const MOVIES = [];

// Theatres
const THEATRES = [
    {
        id: "theatre_1",
        name: "Grand Cinema",
        location: "Downtown",
        amenities: ["Dolby Atmos", "Recliner Seats", "Food Court"]
    },
    {
        id: "theatre_2",
        name: "City Plex",
        location: "Mall Road",
        amenities: ["3D Projection", "VIP Lounge", "Bar"]
    },
    {
        id: "theatre_3",
        name: "IMAX Arena",
        location: "Tech Park",
        amenities: ["IMAX", "4K Laser", "Dolby Vision"]
    }
];

// Showtimes for TMDB movie IDs
const SHOWTIMES = [
    // For movie ID: 1168190 (The Wrecking Crew)
    { id: "show_1", movieId: "1168190", theatreId: "theatre_1", time: "10:30 AM", date: "2024-01-20", format: "2D" },
    { id: "show_2", movieId: "1168190", theatreId: "theatre_1", time: "02:00 PM", date: "2024-01-20", format: "3D" },
    { id: "show_3", movieId: "1168190", theatreId: "theatre_2", time: "06:30 PM", date: "2024-01-20", format: "2D" },

    // For movie ID: 840464 (Greenland 2: Migration)
    { id: "show_4", movieId: "840464", theatreId: "theatre_1", time: "11:00 AM", date: "2024-01-20", format: "IMAX" },
    { id: "show_5", movieId: "840464", theatreId: "theatre_3", time: "08:00 PM", date: "2024-01-20", format: "3D" },

    // For movie ID: 1084242 (Zootopia 2)
    { id: "show_6", movieId: "1084242", theatreId: "theatre_2", time: "10:00 AM", date: "2024-01-20", format: "2D" },
    { id: "show_7", movieId: "1084242", theatreId: "theatre_3", time: "04:30 PM", date: "2024-01-20", format: "3D" },

    // For movie ID: 1419406 (The Shadow's Edge)
    { id: "show_8", movieId: "1419406", theatreId: "theatre_1", time: "12:00 PM", date: "2024-01-20", format: "2D" },

    // For movie ID: 1234731 (Anaconda)
    { id: "show_9", movieId: "1234731", theatreId: "theatre_2", time: "09:00 PM", date: "2024-01-20", format: "3D" },

    // For movie ID: 1271895 (96 Minutes)
    { id: "show_10", movieId: "1271895", theatreId: "theatre_3", time: "07:00 PM", date: "2024-01-20", format: "2D" }
];

// Generate Seats
function generateSeats(showTimeID) {
    const seats = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    rows.forEach((row) => {
        for (let col = 1; col <= 10; col++) {
            seats.push({
                id: `${showTimeID}_${row}${col}`,
                showTimeID: showTimeID,
                seatId: `${row}${col}`,
                status: "available",
                lockedBy: null,
                lockedAt: null,
                bookingID: null,
                type: row === "A" || row === "B" ? "VIP" : "Regular",
            });
        }
    });
    return seats
}

// seed data store
export async function seedFirestore() {
    console.log("🎬 Starting Firebase seeding process...");

    // Check if theatres already exist (to avoid re-seeding)
    const theatresRef = collection(db, "theatres");
    const existingTheatres = await getDocs(theatresRef);

    if (existingTheatres.size === 0) {
        console.log("🎪 Seeding theatres...");
        for (const theatre of THEATRES) {
            await setDoc(doc(db, "theatres", theatre.id), theatre);
        }
        console.log("✅ Theatres seeded successfully");
    } else {
        console.log("✅ Theatres already seeded, skipping...");
    }


    // Seed theatres
    console.log("🎪 Seeding theatres...");
    for (const theatre of THEATRES) {
        await setDoc(doc(db, "theatres", theatre.id), theatre);
    }
    console.log("✅ Theatres seeded successfully");

    // Seed showtimes
    console.log("🕒 Seeding showtimes...");
    for (const show of SHOWTIMES) {
        await setDoc(doc(db, "showtimes", show.id), show);
    }
    console.log("✅ Showtimes seeded successfully");

    // Seed seats for each showtime
    console.log("💺 Seeding seats...");
    for (const show of SHOWTIMES) {
        const seats = generateSeats(show.id);
        for (const seat of seats) {
            await setDoc(doc(db, "seats", seat.id), seat);
        }
    }
    console.log("✅ Seats seeded successfully");

    console.log("🎉 Firebase seeding completed successfully!");
}