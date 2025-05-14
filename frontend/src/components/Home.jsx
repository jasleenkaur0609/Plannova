import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { FaCalendarAlt, FaUsers, FaBell, FaChartLine, FaTicketAlt, FaMoon, FaSun, FaEnvelope,FaMapMarkerAlt,FaLinkedin, FaPhone, FaQuestionCircle, FaFacebook, FaTwitter, FaInstagram, FaBullhorn, FaTasks, FaMapMarkedAlt, FaCog, FaPlus, FaMinus } from "react-icons/fa";
import backgroundImage from "../assets/bg.jpg";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Features
  const features = [
    { icon: FaCalendarAlt, title: "Event Management", description: "Create, edit, and manage events seamlessly with powerful tools." },
    { icon: FaUsers, title: "Attendee Management", description: "Keep track of attendees, communicate, and manage RSVPs effortlessly." },
    { icon: FaChartLine, title: "Analytics & Reports", description: "Gain valuable insights with interactive charts and reports on event performance." },
    { icon: FaTicketAlt, title: "Ticketing & RSVP Tracking", description: "Monitor ticket availability, process RSVPs, and check-in attendees in real-time." },
    { icon: FaBullhorn, title: "Marketing & Announcements", description: "Schedule and automate email and SMS notifications for upcoming events." },
    { icon: FaTasks, title: "Task & Staff Assignments", description: "Assign tasks, set deadlines, and track progress within your team." },
    { icon: FaMapMarkedAlt, title: "Venue & Seating Plans", description: "Design interactive seating arrangements and manage venue layouts efficiently." },
    { icon: FaBell, title: "Real-time Notifications", description: "Get instant alerts for ticket sales, RSVPs, and important updates." },
    { icon: FaCog, title: "Customization & Themes", description: "Personalize the dashboard with themes and settings that match your brand." },
  ];

  // Faq
  const faqs = [
    { question: "How do I create and manage an event?", answer: "You can create and manage events through the admin dashboard by navigating to the 'Events' section. There, you can add details like date, time, location, and categories." },
    { question: "How can I track ticket sales and RSVPs?", answer: "The 'Analytics' section provides real-time insights into ticket sales, RSVPs, and event performance metrics." },
    { question: "Can I customize the dashboard appearance?", answer: "Yes! Navigate to the 'Settings' section to personalize themes, colors, and layout preferences." },
    { question: "How do I send notifications or announcements?", answer: "The 'Marketing' section allows you to schedule and send email or SMS notifications to attendees and subscribers." },
    { question: "What should I do if I forget my password?", answer: "Click on 'Forgot Password' on the login screen and follow the instructions to reset your password." }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Contact Us
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  
  return (
    <div className="bg-[#F7E1D7] text-black transition-all duration-500">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-transparent backdrop-blur-lg shadow-md z-50">
        <h1 className="text-4xl font-bold text-[#B0C4B1]">Plannova</h1>
        <div className="space-x-6 text-xl">
          {[
            { label: "About", to: "about" },
            { label: "Features", to: "features" },
            { label: "Contact", to: "contact" },
            { label: "FAQ", to: "faq" },
          ].map((item, index) => (
            <Link key={index} to={item.to} smooth={true} duration={500} className="hover:text-[#EDAFB8] text-[#B0C4B1] cursor-pointer">
              {item.label}
            </Link>
          ))}
        </div>
        {/* <button onClick={() => setDarkMode(!darkMode)} className="text-2xl p-2 rounded-md text-white focus:outline-none transition duration-300">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button> */}
      </nav>

      {/* Hero Section */}
      <section className="relative text-center py-60 px-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></motion.div>
        <motion.div className="relative z-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-6xl font-bold drop-shadow-lg text-[#4A5759]">
            Transform the Way You Manage Events!
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mt-6 text-xl drop-shadow-md max-w-3xl mx-auto text-[#4A5759]">
            Plannova provides an all-in-one solution for event organizers and attendees.
          </motion.p>
          <motion.div className="mt-8 space-x-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <a href="/register" className="px-6 py-3 bg-[#EDAFB8] text-white rounded-lg text-lg font-bold hover:bg-[#B0C4B1] transition">Register</a>
            <a href="/login" className="px-6 py-3 bg-[#4A5759] text-white rounded-lg text-lg font-bold hover:bg-[#B0C4B1] transition">Login</a>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <motion.section
      id="about"
      className="py-24 px-10 bg-gradient-to-b from-[#F7E1D7] to-[#B0C4B1] text-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-6xl font-extrabold text-center text-[#4A5759] drop-shadow-lg">About Us</h2>
      <p className="mt-6 text-xl max-w-3xl mx-auto text-center font-light italic">
        Plannova is dedicated to providing seamless event management solutions, blending innovation with efficiency.
      </p>

      {/* Mission & Vision */}
      <motion.div className="mt-16 text-center bg-white p-10 rounded-2xl shadow-lg" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
        <h3 className="text-4xl font-bold text-[#4A5759]">Our Mission</h3>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
          Plannova aims to revolutionize event planning by simplifying organization, enhancing collaboration, and ensuring stress-free experiences.
        </p>
        <h3 className="text-4xl font-bold mt-10 text-[#4A5759]">Our Vision</h3>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
          To become the leading platform for event management, empowering individuals and organizations to create unforgettable experiences effortlessly.
        </p>
      </motion.div>

      {/* Team & Expertise */}
      <motion.div className="mt-16 text-center" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
        <h3 className="text-4xl font-bold text-[#4A5759]">Meet Our Team</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Jasleen Kaur", img: "#" },
            { name: "Kashish Gulati", img: "#" },
            { name: "Khushi Goyal", img: "#" },
          ].map((member, index) => (
            <motion.div key={index} className="p-6 bg-white rounded-2xl shadow-xl hover:scale-105 transition-transform">
              <img src={member.img} alt={member.name} className="w-24 h-24 mx-auto rounded-full border-4 border-[#EDAFB8]" />
              <h4 className="mt-4 text-xl font-semibold text-[#4A5759]">{member.name}</h4>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div className="mt-16 text-center" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
        <h3 className="text-4xl font-bold text-[#4A5759]">Benefits</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {["Ease of Use", "Automation", "Efficiency"].map((benefit, index) => (
            <motion.div key={index} className="p-6 bg-white rounded-2xl shadow-lg hover:scale-105 transition-transform">
              <h4 className="text-xl font-semibold text-[#4A5759]">{benefit}</h4>
              <p className="text-gray-600 mt-2">{benefit} in event management like never before.</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      {/* <motion.div className="mt-16 text-center" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
        <h3 className="text-4xl font-bold text-[#4A5759]">Join Plannova Today</h3>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
          Take the next step in hassle-free event planning. Sign up now and experience the future of event management.
        </p>
        <button className="mt-6 px-6 py-3 bg-[#EDAFB8] text-white font-semibold rounded-xl shadow-lg hover:bg-[#DEDBD2] transition-transform hover:scale-105">
          Get Started
        </button>
      </motion.div> */}
    </motion.section>

      {/* Features Section */}
      <motion.section
      id="features"
      className="py-24 px-10 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-6xl font-extrabold text-center text-[#4A5759] drop-shadow-lg">Why Choose Plannova?</h2>
      <p className="text-lg text-center mt-4 max-w-3xl mx-auto text-gray-600">
        Unlock powerful tools to manage your events effortlessly with Plannova's feature-rich admin dashboard.
      </p>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            className="p-8 bg-[#F7E1D7] shadow-xl rounded-2xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:scale-105"
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <feature.icon className="text-5xl text-[#EDAFB8] transition-colors duration-300 group-hover:text-[#4A5759]" />
            <div>
              <h3 className="text-2xl font-bold text-[#4A5759] group-hover:text-[#EDAFB8] transition-colors duration-300">{feature.title}</h3>
              <p className="mt-2 text-lg text-gray-700 transition-opacity duration-300 group-hover:opacity-80">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>

      {/* FAQ Section */}
      <motion.section
      id="faq"
      className="py-24 px-10 bg-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-5xl font-bold text-center text-[#4A5759] drop-shadow-lg">Frequently Asked Questions</h2>
      <p className="text-lg text-center mt-4 max-w-3xl mx-auto text-gray-600">
        Find answers to common questions about managing events with Plannova.
      </p>

      <div className="mt-12 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-xl mb-6 p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-[#4A5759]">{faq.question}</h3>
              {openIndex === index ? <FaMinus className="text-xl text-[#EDAFB8]" /> : <FaPlus className="text-xl text-[#EDAFB8]" />}
            </div>
            {openIndex === index && (
              <motion.p
                className="mt-3 text-lg text-gray-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                {faq.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>


      {/* Contact Section */}
      <motion.section
      id="contact"
      className="py-24 px-10 bg-[#DEDDB2] text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-5xl font-bold text-[#4A5759] drop-shadow-lg">Contact Us</h2>
      <p className="text-lg mt-4 max-w-3xl mx-auto text-gray-700">
        Get in touch with us for any inquiries, support, or feedback. Our team is happy to assist you.
      </p>

      <div className="mt-12 flex flex-col md:flex-row gap-12 max-w-6xl mx-auto items-start">
        {/* Contact Form */}
        <motion.form
          className="bg-white p-8 shadow-xl rounded-2xl flex flex-col gap-6 flex-1 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          whileHover={{ scale: 1.02 }}
          onSubmit={handleSubmit}
        >
          <input type="text" name="name" placeholder="Your Name" className="p-3 border rounded-lg focus:ring-2 focus:ring-[#EDAFB8] transition-all" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" className="p-3 border rounded-lg focus:ring-2 focus:ring-[#EDAFB8] transition-all" onChange={handleChange} required />
          <input type="text" name="subject" placeholder="Subject" className="p-3 border rounded-lg focus:ring-2 focus:ring-[#EDAFB8] transition-all" onChange={handleChange} required />
          <textarea name="message" placeholder="Your Message" rows="5" className="p-3 border rounded-lg focus:ring-2 focus:ring-[#EDAFB8] transition-all" onChange={handleChange} required></textarea>
          <motion.button
            type="submit"
            className="bg-[#EDAFB8] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#B0C4B1] transition-all duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            Send Message
          </motion.button>
          {submitted && <p className="text-green-500 mt-3">Thank you! Your message has been sent.</p>}
        </motion.form>

        {/* Contact Info */}
        <motion.div 
          className="flex flex-col gap-6 items-start text-left bg-white p-8 shadow-xl rounded-2xl flex-1 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4 text-xl text-[#4A5759]">
            <FaEnvelope className="text-3xl text-[#EDAFB8]" /> support@plannova.com
          </div>
          <div className="flex items-center gap-4 text-xl text-[#4A5759]">
            <FaPhone className="text-3xl text-[#EDAFB8]" /> +1 (XXX) XXX-XXXX
          </div>
          <div className="flex items-center gap-4 text-xl text-[#4A5759]">
            <FaMapMarkerAlt className="text-3xl text-[#EDAFB8]" /> 123 Event Street, City, Country
          </div>
          <p className="text-lg text-gray-700">We typically respond within 24 hours.</p>

          {/* Social Media */}
          <div className="flex gap-6 mt-4">
            <FaFacebook className="text-3xl text-[#4A5759] hover:text-[#EDAFB8] transition-all duration-300 cursor-pointer" />
            <FaTwitter className="text-3xl text-[#4A5759] hover:text-[#EDAFB8] transition-all duration-300 cursor-pointer" />
            <FaLinkedin className="text-3xl text-[#4A5759] hover:text-[#EDAFB8] transition-all duration-300 cursor-pointer" />
          </div>
        </motion.div>
      </div>
    </motion.section>

      {/* Footer */}
      <footer className="bg-[#333] text-gray-300 text-center py-8">
        <p>&copy; 2025 Plannova. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;