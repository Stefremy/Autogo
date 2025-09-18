import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

// Resolve the cars JSON file relative to the project. When the Next.js
// server is started from the `frontend` directory, `process.cwd()` points
// there, so joining with `data/cars.json` locates the file correctly.
const carsFile = path.join(process.cwd(), "data/cars.json");
const API_KEY = process.env.API_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (["POST", "DELETE"].includes(req.method as string)) {
    const key = req.headers["x-api-key"];
    if (!API_KEY || key !== API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
  if (req.method === "GET") {
    // List all cars
    try {
      const data = fs.readFileSync(carsFile, "utf-8");
      const cars = JSON.parse(data);
      res.status(200).json(cars);
    } catch (err) {
      res.status(500).json({ error: "Failed to read cars data." });
    }
  } else if (req.method === "POST") {
    // Add a new car
    try {
      const data = fs.readFileSync(carsFile, "utf-8");
      const cars = JSON.parse(data);
      const newCar = req.body;
      cars.push(newCar);
      fs.writeFileSync(carsFile, JSON.stringify(cars, null, 2));
      res.status(201).json(newCar);
    } catch (err) {
      res.status(500).json({ error: "Failed to add car." });
    }
  } else if (req.method === "DELETE") {
    // Delete a car by id
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Missing car id." });
      }
      const data = fs.readFileSync(carsFile, "utf-8");
      let cars = JSON.parse(data);
      const initialLength = cars.length;
      cars = cars.filter((car: any) => String(car.id) !== String(id));
      if (cars.length === initialLength) {
        return res.status(404).json({ error: "Car not found." });
      }
      fs.writeFileSync(carsFile, JSON.stringify(cars, null, 2));
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete car." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
