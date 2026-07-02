import { useState } from "react";

function FindTallestStudent() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");

  // Add student to the list
  const addStudent = () => {
    if (name && height) {
      setStudents([...students, { name, height: parseInt(height) }]);
      setName("");
      setHeight("");
    }
  };

  // Find tallest student
  const tallestStudent =
    students.length > 0
      ? students.reduce((prev, current) =>
          current.height > prev.height ? current : prev
        )
      : null;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Enter Student Details</h2>

      {/* Input fields */}
      <input
        type="text"
        placeholder="Enter student name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter height (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <button onClick={addStudent}>Add Student</button>

      <h3>Students List:</h3>
      <ul>
        {students.map((student, index) => (
          <li key={index}>
            {student.name} - {student.height} cm
          </li>
        ))}
      </ul>

      {tallestStudent && (
        <h3>
          🏆 {tallestStudent.name} is the tallest student with{" "}
          {tallestStudent.height} cm.
        </h3>
      )}
    </div>
  );
}

export default FindTallestStudent;
