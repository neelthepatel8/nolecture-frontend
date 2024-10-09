"use client";
import { useState, useEffect } from "react";
interface Classroom {
  room_number: string;
  building_name: string;
  next_lecture_time: string | null;
}

const Home = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://api-iijor.ondigitalocean.app/api/free-classrooms"
        );
        const data: Classroom[] = await response.json();
        setClassrooms(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Free Classrooms</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-6 py-3 text-gray-600 font-bold uppercase">
              Room Number
            </th>
            <th className="px-6 py-3 text-gray-600 font-bold uppercase">
              Building Name
            </th>
            <th className="px-6 py-3 text-gray-600 font-bold uppercase">
              Next Lecture Time
            </th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((classroom, index) => (
            <tr key={index} className="border-t">
              <td className="px-6 py-4">{classroom.room_number}</td>
              <td className="px-6 py-4">{classroom.building_name}</td>
              <td className="px-6 py-4">
                {classroom.next_lecture_time
                  ? classroom.next_lecture_time
                  : "No lectures today"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
