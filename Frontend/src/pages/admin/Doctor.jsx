import React, { useState, useEffect } from "react";

export default function Doctors() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/v1/admin/doctorsList?name=Admin"
        );

        const data = await res.json();
        // console.log(data?.data);

        setList(data?.data || []);
      } catch (err) {
        console.log("Error ", err);
      }
    };
    fetchList();
  }, []);

  // Search filter + Alphabetical sort
  const filteredDoctors = list
  .filter((doc) =>
    doc.drname?.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => a.drname.localeCompare(b.drname));
  

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
        Doctor List
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded-lg 
        bg-white text-black border-gray-300
        dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      {/* Table View */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-gray-700 dark:text-gray-200">ID</th>
              <th className="text-gray-700 dark:text-gray-200">Doctor Name</th>
              <th className="text-gray-700 dark:text-gray-200">Specialization</th>
              <th className="text-gray-700 dark:text-gray-200">Qualification</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, index) => (
                <tr
                  key={doc._id || index}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {index + 1}
                  </td>
                  <td className="text-gray-800 dark:text-gray-100">{doc.drname}</td>
                  <td className="text-gray-800 dark:text-gray-100">
                    {doc.specialization || "N/A"}
                  </td>
                  <td className="text-gray-800 dark:text-gray-100">
                    {doc.qualification || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-3 text-gray-500 dark:text-gray-400"
                >
                  No Doctor found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* List View */}
      <div className="space-y-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div
              key={doc._id || doc.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {doc.drname}
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                Specialization: {doc.specialization || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                Qualification: {doc.qualification || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center p-3 text-gray-500 dark:text-gray-400">
            No doctors found
          </div>
        )}
      </div>
    </div>
  );
}
