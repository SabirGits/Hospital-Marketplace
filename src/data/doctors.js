import { hospitals } from "./hospitals";

const names = [
  "Dr. Aarav Sharma", "Dr. Priya Mehta", "Dr. Rohan Kapoor", "Dr. Sneha Iyer", "Dr. Vikram Singh",
  "Dr. Ananya Rao", "Dr. Karan Malhotra", "Dr. Ishita Verma", "Dr. Arjun Nair", "Dr. Divya Joshi",
  "Dr. Rahul Gupta", "Dr. Neha Choudhary", "Dr. Aditya Bansal", "Dr. Meera Pillai", "Dr. Siddharth Rathore",
  "Dr. Kavya Desai", "Dr. Manish Trivedi", "Dr. Pooja Agarwal", "Dr. Nikhil Chauhan", "Dr. Ritu Saxena",
  "Dr. Sameer Khan", "Dr. Alisha Bose",
];
const specialtyList = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Gynecology", "Oncology", "General Medicine", "Dentistry", "ENT"];
const qualifications = ["MBBS, MD", "MBBS, MS", "MBBS, DM", "MBBS, MCh", "BDS, MDS", "MBBS, DNB"];

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SIT_TIMES = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:00 PM", "05:30 PM"];

// Each doctor sits at a fixed time on the days they work — a hospital can
// change this per day from the dashboard (see HospitalDashboard's schedule editor).
function buildSchedule(seed) {
  const schedule = {};
  WEEKDAYS.forEach((day, i) => {
    const worksToday = (seed + i) % 7 !== 0; // one day off per week, staggered by doctor
    if (worksToday) schedule[day] = SIT_TIMES[(seed + i) % SIT_TIMES.length];
  });
  return schedule;
}

export const doctors = names.map((name, i) => {
  const hospital = hospitals[i % hospitals.length];
  return {
    id: `doc-${i + 1}`,
    name,
    photo: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${(i * 7) % 90}.jpg`,
    specialty: specialtyList[i % specialtyList.length],
    qualification: qualifications[i % qualifications.length],
    experience: 4 + ((i * 3) % 22),
    hospital: hospital.name,
    hospitalId: hospital.id,
    city: hospital.city,
    verified: i % 5 !== 0,
    rating: +(3.9 + ((i * 29) % 10) / 10).toFixed(1),
    reviews: 15 + ((i * 41) % 300),
    fee: 300 + ((i * 50) % 1200),
    available: i % 4 !== 0,
    languages: i % 2 === 0 ? ["English", "Hindi"] : ["English", "Hindi", "Rajasthani"],
    bio: `${name} is a specialist in ${specialtyList[i % specialtyList.length].toLowerCase()} with ${4 + ((i * 3) % 22)} years of clinical experience at ${hospital.name}.`,
    schedule: buildSchedule(i),
  };
});

export const getDoctorById = (id) => doctors.find((d) => d.id === id);
