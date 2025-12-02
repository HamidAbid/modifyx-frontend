"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

const carModsData = [
  {
    id: 1,
    title: "Body Kit Upgrade",
    description:
      "Transform your car’s look with a full custom body kit, including bumpers, side skirts, and diffusers.",
    image:
      "https://res.cloudinary.com/dbkyvye1k/image/upload/v1764677231/bodykit_potrlx.jpg",
    price: "45,000 - 100,000",
    features: [
      "Front and rear bumpers",
      "Side skirts",
      "Paint matching",
      "Professional fitting",
    ],
  },
  {
    id: 2,
    title: "LED Lighting Package",
    description:
      "Upgrade your car’s lighting with modern LED headlights, taillights, and ambient interior glow.",
    image:
      "https://res.cloudinary.com/dbkyvye1k/image/upload/v1764677232/carlight_bizjnu.jpg",
    price: "18,000 - 80,000",
    features: [
      "LED headlights",
      "Taillight upgrade",
      "Ambient interior lighting",
      "Professional wiring setup",
    ],
  },
  {
    id: 3,
    title: "Custom Alloy Rims",
    description:
      "Enhance your car’s stance and handling with lightweight, stylish alloy rims.",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
    price: "100,000 - 800,000 ",
    features: [
      "Set of 4 alloy rims",
      "Size options: 16–20 inch",
      "Gloss or matte finish",
      "Performance balancing",
    ],
  },
];

const EventOrganizer = () => {
  const { token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carPackage: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePackageSelect = (mod) => {
    setSelectedPackage(mod);
    setFormData({ ...formData, carPackage: mod.title });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(formData);
    if(!token){
      toast.error('Login First')
      return 
    } 
    try {
      await axios.post(
        "/api/package/",
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Request submitted! We'll contact you shortly.");
      setShowForm(false);
      setFormData({ name: "", email: "", phone: "", carPackage: "", message: "" });
      setSelectedPackage(null);
    } catch (error) {
      
      toast.error("Error submitting request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center py-52 bg-[url('https://res.cloudinary.com/dbkyvye1k/image/upload/v1764677275/packagehero_wuby25.jpg')]
" >
        <div className="absolute inset-0 bg-black/40  blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Car Modification Services</h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Transform your ride with premium cosmetic upgrades and custom styling parts.
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-bold text-red-600">Our Packages</h2>
          <p className="mt-4 text-lg text-slate-400">
            Pick a package and upgrade your car today!
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {carModsData.map((mod) => (
            <div key={mod.id} className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
              <img src={mod.image} alt={mod.title} className="h-64 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-red-500 mb-2">{mod.title}</h3>
                <p className="text-slate-300 mb-4">{mod.description}</p>
                <p className="text-primary font-bold mb-4">Starting at PKR {mod.price}</p>
                <h4 className="font-medium text-red-500 mb-2">Includes:</h4>
                <ul className="mb-6 space-y-1 text-slate-300">
                  {mod.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePackageSelect(mod)}
                  className="bg-red-600 hover:bg-red-700 p-2 text-white w-full rounded"
                >
                  Request This Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 text-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">Request Package</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-500">
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-slate-200 bg-slate-800 p-2 w-full rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="text-slate-200 bg-slate-800 p-2 w-full rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="text-slate-200 bg-slate-800 p-2 w-full rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Selected Package</label>
                  <input
                    type="text"
                    name="carPackage"
                    value={formData.carPackage}
                    readOnly
                    className="text-slate-200 bg-slate-700 p-2 w-full rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Additional Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="text-slate-200 bg-slate-800 p-2 w-full rounded"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 p-3 w-full rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventOrganizer;
