"use client";
import { useState, useEffect } from "react";
import { usePagination } from "@/hooks/usePagination";

interface Classroom {
  room_number: string;
  building_name: string;
  next_lecture_time: string | null;
}

const Home = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [buildingFilter, setBuildingFilter] = useState<string>("");
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const { next, prev, currentData, currentPage, maxPage } = usePagination(
    filteredClassrooms,
    itemsPerPage
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://api-iijor.ondigitalocean.app/api/free-classrooms"
        );
        const data: Classroom[] = await response.json();
        setClassrooms(data);
        setFilteredClassrooms(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (buildingFilter === "") {
      setFilteredClassrooms(
        classrooms.filter((classroom) => classroom.next_lecture_time != null)
      );
    } else {
      const filtered = classrooms.filter((classroom) =>
        classroom.building_name
          .toLowerCase()
          .includes(buildingFilter.toLowerCase())
      );
      setFilteredClassrooms(filtered);
    }
  }, [buildingFilter, classrooms]);

  const formatTimeToAMPM = (time: string | null) => {
    if (!time) return "No lectures today";

    const [hours, minutes, seconds] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || "0"));

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20 pt-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Free Classrooms Right Now
      </h1>
      <h1 className="text-xl font-semibold mb-6 text-center">
        Currently {filteredClassrooms.length} classrooms are free!
      </h1>

      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Filter by Building Name"
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg text-center">
        <thead className="text-center">
          <tr className="bg-gray-200 text-center">
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
          {currentData().map((classroom, index) => (
            <tr key={index} className="border-t">
              <td className="px-6 py-4">{classroom.room_number}</td>
              <td className="px-6 py-4">{classroom.building_name}</td>
              <td className="px-6 py-4">
                {formatTimeToAMPM(classroom.next_lecture_time)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-row items-center justify-between px-12 mt-4">
        <div className="flex justify-center">
          <button
            onClick={prev}
            disabled={currentPage === 1}
            className="mx-2 px-4 py-2 border rounded-lg bg-gray-200 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="mx-2 px-4 py-2">
            Page {currentPage} of {maxPage}
          </span>
          <button
            onClick={next}
            disabled={currentPage === maxPage}
            className="mx-2 px-4 py-2 border rounded-lg bg-gray-200 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
        <div className="text-center">
          <label htmlFor="itemsPerPage" className="mr-2 font-semibold">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Home;
