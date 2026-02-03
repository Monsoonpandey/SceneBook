import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Facebook, Twitter, Instagram, Youtube, ChevronDown, ChevronUp } from 'lucide-react';

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const faqs = [
    {
      question: "How do I book a movie ticket?",
      answer: "Simply select a movie, choose your showtime, select seats, and proceed to payment. You'll receive a confirmation email with your tickets."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel bookings up to 2 hours before showtime. Modifications are subject to seat availability."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets like PayPal and Google Pay."
    },
    {
      question: "Are there any booking fees?",
      answer: "No, we don't charge any booking fees. You only pay for your tickets and applicable taxes."
    },
    {
      question: "How do I get my tickets?",
      answer: "Tickets are sent to your registered email. You can also access them in 'My Bookings' section after logging in."
    }
  ];

  return (
    <footer className="bg-gradient-to-t from-gray-900 via-purple-900/30 to-gray-900 border-t border-purple-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Film className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
                CineVerse
              </span>
            </Link>
            <p className="text-gray-400">
              Your ultimate destination for the best movie experience. Book tickets, discover new films, and enjoy exclusive content.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?category=coming-soon" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=action" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Action Movies
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=drama" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Drama Movies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* FAQs - Mobile Accordion / Desktop List */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between lg:justify-start">
              Frequently Asked Questions
              <button
                className="lg:hidden"
                onClick={() => toggleSection('faqs')}
              >
                {openSection === 'faqs' ? <ChevronUp /> : <ChevronDown />}
              </button>
            </h3>

            <div className={`space-y-3 ${openSection === 'faqs' || 'lg:block'}`}>
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-800 pb-3">
                  <button
                    className="flex justify-between items-center w-full text-left text-gray-400 hover:text-white transition-colors duration-300"
                    onClick={() => toggleSection(`faq-${index}`)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${openSection === `faq-${index}` ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`mt-2 text-gray-500 text-sm ${openSection === `faq-${index}` ? 'block' : 'hidden lg:block'}`}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms & Conditions
              </Link>
              <Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Refund Policy
              </Link>
              <a href="mailto:support@cineverse.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                support@cineverse.com
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CineVerse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;