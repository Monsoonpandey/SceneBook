import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    setDoc,
} from "firebase/firestore";

import { db } from "../config/Firebase";

/* ---------------- MOVIES ---------------- */

const MOVIES = [
    {
        id: "movie_1",
        title: "Inception",
        genre: ["Sci-Fi", "Thriller"],
        rating: 8.8,
        synopsis: "A thief who enters dream worlds...",
        duration: 148,
        status: "now_showing",
        poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
    },
    {
        id: "movie_2",
        title: "The Dark Knight",
        genre: ["Action", "Drama"],
        rating: 9.0,
        synopsis: "Batman raises the stakes...",
        duration: 152,
        status: "now_showing",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    },
];

/* ---------------- THEATRES ---------------- */

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

/* ---------------- SHOWTIMES ---------------- */

const SHOWTIMES = [
    { id: "show_1", movieId: "movie_1", theatreId: "theatre_1", time: "10:30 AM", date: "2024-01-20", format: "2D" },
    { id: "show_2", movieId: "movie_1", theatreId: "theatre_1", time: "02:00 PM", date: "2024-01-20", format: "3D" },
    { id: "show_3", movieId: "movie_1", theatreId: "theatre_2", time: "06:30 PM", date: "2024-01-20", format: "2D" },
    { id: "show_4", movieId: "movie_1", theatreId: "theatre_3", time: "09:00 PM", date: "2024-01-20", format: "IMAX" },

    { id: "show_5", movieId: "movie_2", theatreId: "theatre_1", time: "11:00 AM", date: "2024-01-20", format: "IMAX" },
    { id: "show_6", movieId: "movie_2", theatreId: "theatre_2", time: "03:00 PM", date: "2024-01-20", format: "2D" },
    { id: "show_7", movieId: "movie_2", theatreId: "theatre_3", time: "08:00 PM", date: "2024-01-20", format: "3D" },
    { id: "show_8", movieId: "movie_2", theatreId: "theatre_3", time: "11:30 PM", date: "2024-01-20", format: "2D" },
];

/* ---------------- SEAT GENERATOR ---------------- */

function generateSeats(showTimeID) {
    const seats = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    rows.forEach((row) => {
        for (let col = 1; col <= 10; col++) {
            seats.push({
                id: `${showTimeID}_${row}${col}`,
                showTimeID,
                seatId: `${row}${col}`,
                status: "available",
                lockedBy: null,
                lockedAt: null,
                bookingID: null,
                type: row === "A" || row === "B" ? "VIP" : "Regular",
            });
        }
    });

    return seats;
}

/* ---------------- SEED FUNCTION ---------------- */

export async function seedFirestore() {
    console.log("🎬 Starting Firebase seeding process...");

    const theatresRef = collection(db, "theatres");
    const existingTheatres = await getDocs(theatresRef);

    if (existingTheatres.size > 0) {
        console.log("✅ Data already seeded, skipping...");
        return;
    }

    console.log("🎪 Seeding theatres...");
    for (const theatre of THEATRES) {
        await setDoc(doc(db, "theatres", theatre.id), theatre);
    }

    console.log("🕒 Seeding showtimes...");
    for (const show of SHOWTIMES) {
        await setDoc(doc(db, "showtimes", show.id), show);
    }

    console.log("💺 Seeding seats...");
    for (const show of SHOWTIMES) {
        const seats = generateSeats(show.id);
        for (const seat of seats) {
            await setDoc(doc(db, "seats", seat.id), seat);
        }
    }

    console.log("🎉 Firebase seeding completed!");
}
