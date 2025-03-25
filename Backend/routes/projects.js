const express = require("express");
const { ProjectModel } = require("../models/projects.model");
const ProjectRouter = express.Router();
const { authenticate } = require("../middleware/authenticate.js");

// Middleware for authentication
ProjectRouter.use(authenticate);

// Search salons by location and service
ProjectRouter.get("/search", async (req, res) => {
   try {
      const { location, service } = req.query;
      
      if (!location) {
         return res.status(400).json({ error: "Location is required" });
      }

      let query = {
         location: { $regex: location, $options: 'i' }
      };

      if (service) {
         query.services = { 
            $elemMatch: { 
               servicesName: { $regex: service, $options: 'i' } 
            } 
         };
      }

      const data = await ProjectModel.find(query)
         .sort({ rating: -1 })
         .limit(20);

      res.json(data);
   } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ 
         error: "Failed to search salons",
         details: error.message 
      });
   }
});

// Get all salons
ProjectRouter.get("/service", async (req, res) => {
   try {
      const data = await ProjectModel.find()
         .sort({ rating: -1 })
         .limit(20);
      res.json(data);
   } catch (error) {
      console.error("Get all error:", error);
      res.status(500).json({ 
         error: "Failed to get salons",
         details: error.message 
      });
   }
});

// Get single salon by ID
ProjectRouter.get("/data/:id", async (req, res) => {
   try {
      const data = await ProjectModel.findById(req.params.id);
      if (!data) {
         return res.status(404).json({ error: "Salon not found" });
      }
      res.json(data);
   } catch (error) {
      console.error("Get by ID error:", error);
      res.status(500).json({ 
         error: "Failed to get salon",
         details: error.message 
      });
   }
});

// Add new salon
ProjectRouter.post("/add", async (req, res) => {
   try {
      const { name, image, location, rating, services, availableTime } = req.body;
      
      if (!name || !image || !location || !services || !availableTime) {
         return res.status(400).json({ 
            error: "Missing required fields",
            required: ["name", "image", "location", "services", "availableTime"]
         });
      }

      const newSalon = new ProjectModel(req.body);
      await newSalon.save();
      
      res.status(201).json({ 
         message: "Salon added successfully",
         data: newSalon 
      });
   } catch (error) {
      console.error("Add salon error:", error);
      res.status(500).json({ 
         error: "Failed to add salon",
         details: error.message 
      });
   }
});

// Delete salon
ProjectRouter.delete("/delete/:id", async (req, res) => {
   try {
      const salon = await ProjectModel.findById(req.params.id);
      if (!salon) {
         return res.status(404).json({ error: "Salon not found" });
      }

      await ProjectModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Salon deleted successfully" });
   } catch (error) {
      console.error("Delete salon error:", error);
      res.status(500).json({ 
         error: "Failed to delete salon",
         details: error.message 
      });
   }
});

// Seed initial data
ProjectRouter.post("/seed", async (req, res) => {
   try {
      const salonData = [
         {
            name: "Naturals Family Salon & Spa",
            image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2069&auto=format&fit=crop",
            location: "Chennai",
            rating: 4.7,
            reviews: 1250,
            services: [
               { servicesName: "Hair Cut", price: "300" },
               { servicesName: "Hair Spa", price: "800" },
               { servicesName: "Hair Color", price: "1200" }
            ],
            availableTime: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
            openingHours: {
               monday: ["10:00 AM", "8:00 PM"],
               sunday: ["10:00 AM", "8:00 PM"]
            }
         },
         {
            name: "Green Trends Hair & Style",
            image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop",
            location: "Chennai",
            rating: 4.5,
            reviews: 980,
            services: [
               { servicesName: "Hair Cut", price: "250" },
               { servicesName: "Shave", price: "150" },
               { servicesName: "Facial", price: "600" }
            ],
            availableTime: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"],
            openingHours: {
               monday: ["9:00 AM", "7:00 PM"],
               sunday: ["10:00 AM", "6:00 PM"]
            }
         },
         {
            name: "Limelite Salon & Spa",
            image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Chennai",
            rating: 4.8,
            reviews: 1500,
            services: [
               { servicesName: "Hair Cut", price: "400" },
               { servicesName: "Hair Treatment", price: "1500" },
               { servicesName: "Manicure", price: "500" }
            ],
            availableTime: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
            openingHours: {
               monday: ["10:00 AM", "8:00 PM"],
               sunday: ["11:00 AM", "7:00 PM"]
            }
         },
         // --- Chittaranjan, West Bengal Salons ---
         {
            name: "Looks Unisex Salon",
            image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Chittaranjan, West Bengal",
            rating: 4.6,
            reviews: 820,
            services: [
               { servicesName: "Hair Cut", price: "350" },
               { servicesName: "Beard Trim", price: "200" },
               { servicesName: "Hair Spa", price: "900" }
            ],
            availableTime: ["9:30 AM", "11:30 AM", "2:30 PM", "6:00 PM"],
            openingHours: {
               monday: ["9:30 AM", "8:00 PM"],
               sunday: ["10:00 AM", "6:30 PM"]
            }
         },
         {
            name: "VLCC Beauty Salon",
            image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Chittaranjan, West Bengal",
            rating: 4.4,
            reviews: 640,
            services: [
               { servicesName: "Facial", price: "700" },
               { servicesName: "Pedicure", price: "500" },
               { servicesName: "Hair Coloring", price: "1100" }
            ],
            availableTime: ["10:00 AM", "12:00 PM", "3:00 PM", "5:30 PM"],
            openingHours: {
               monday: ["10:00 AM", "7:30 PM"],
               sunday: ["10:30 AM", "6:00 PM"]
            }
         },
         {
            name: "Royal Men's Salon",
            image: "https://unsplash.com/photos/a-room-filled-with-furniture-and-a-large-window-_C-S7LqxHPw",
            location: "Chittaranjan, West Bengal",
            rating: 4.7,
            reviews: 900,
            services: [
               { servicesName: "Hair Cut", price: "300" },
               { servicesName: "Shave", price: "150" },
               { servicesName: "Massage", price: "600" }
            ],
            availableTime: ["9:00 AM", "11:00 AM", "4:00 PM", "7:00 PM"],
            openingHours: {
               monday: ["9:00 AM", "8:30 PM"],
               sunday: ["10:00 AM", "7:00 PM"]
            }
         }
      ];

      // Clear existing data and seed new data
      await ProjectModel.deleteMany({});
      await ProjectModel.insertMany(salonData);
      
      res.json({ 
         message: "Database seeded successfully", 
         data: salonData 
      });
   } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ 
         error: "Failed to seed database",
         details: error.message 
      });
   }
});

module.exports = { ProjectRouter };
