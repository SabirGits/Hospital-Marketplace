const base = [
  { name: "Alwar City Hospital", city: "Alwar", type: "Multi-Specialty", est: 1998, beds: 210, emergency: true, specialties: ["Cardiology", "Orthopedics", "General Medicine"], image: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=900&q=80" },
  { name: "Sunrise Medicity Alwar", city: "Alwar", type: "Super-Specialty", est: 2010, beds: 160, emergency: true, specialties: ["Neurology", "Oncology"], image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80" },
  { name: "Aravalli Care Hospital", city: "Alwar", type: "General", est: 2005, beds: 90, emergency: false, specialties: ["Pediatrics", "Gynecology"], image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80" },
  { name: "Jaipur Heart Institute", city: "Jaipur", type: "Super-Specialty", est: 2001, beds: 320, emergency: true, specialties: ["Cardiology", "ICU"], image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80" },
  { name: "Pink City General Hospital", city: "Jaipur", type: "Multi-Specialty", est: 1992, beds: 410, emergency: true, specialties: ["Orthopedics", "General Medicine", "Dentistry"], image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=80" },
  { name: "Jaipur Mother & Child Care", city: "Jaipur", type: "Specialty", est: 2013, beds: 120, emergency: true, specialties: ["Gynecology", "Pediatrics"], image: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=900&q=80" },
  { name: "Rajasthan Cancer Institute", city: "Jaipur", type: "Super-Specialty", est: 2008, beds: 180, emergency: false, specialties: ["Oncology"], image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80" },
  { name: "Capital Multi-Specialty Hospital", city: "Delhi", type: "Multi-Specialty", est: 1985, beds: 520, emergency: true, specialties: ["Cardiology", "Neurology", "Orthopedics"], image: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=900&q=80" },
  { name: "Delhi Neuro & Spine Center", city: "Delhi", type: "Super-Specialty", est: 2006, beds: 140, emergency: true, specialties: ["Neurology"], image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80" },
  { name: "Yamuna Care Hospital", city: "Delhi", type: "General", est: 1999, beds: 260, emergency: true, specialties: ["General Medicine", "ENT"], image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80" },
  { name: "Lotus Women's Hospital", city: "Delhi", type: "Specialty", est: 2011, beds: 110, emergency: false, specialties: ["Gynecology"], image: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=900&q=80" },
  { name: "Gurgaon Global Hospital", city: "Gurgaon", type: "Super-Specialty", est: 2004, beds: 380, emergency: true, specialties: ["Cardiology", "Oncology", "ICU"], image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=80" },
  { name: "Cyber City Skin & Derma Clinic Hospital", city: "Gurgaon", type: "Specialty", est: 2015, beds: 40, emergency: false, specialties: ["Dermatology"], image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80" },
  { name: "Aravali Bone & Joint Hospital", city: "Gurgaon", type: "Specialty", est: 2009, beds: 130, emergency: true, specialties: ["Orthopedics"], image: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=900&q=80" },
  { name: "Mumbai Central Hospital", city: "Mumbai", type: "Multi-Specialty", est: 1978, beds: 610, emergency: true, specialties: ["Cardiology", "Neurology", "General Medicine"], image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80" },
  { name: "Arabian Sea Children's Hospital", city: "Mumbai", type: "Specialty", est: 2000, beds: 150, emergency: true, specialties: ["Pediatrics"], image: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=900&q=80" },
  { name: "Bandra Cancer Care Institute", city: "Mumbai", type: "Super-Specialty", est: 2012, beds: 200, emergency: false, specialties: ["Oncology"], image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80" },
  { name: "Marine Drive Dental & Care Hospital", city: "Mumbai", type: "Specialty", est: 2016, beds: 30, emergency: false, specialties: ["Dentistry"], image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=80" },
  { name: "Sabarmati Multispecialty Hospital", city: "Ahmedabad", type: "Multi-Specialty", est: 1995, beds: 340, emergency: true, specialties: ["Cardiology", "Orthopedics"], image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80" },
  { name: "Ahmedabad Kidney Institute", city: "Ahmedabad", type: "Super-Specialty", est: 2007, beds: 90, emergency: true, specialties: ["Nephrology"], image: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=900&q=80" },
  { name: "Lake City Hospital Udaipur", city: "Udaipur", type: "General", est: 1990, beds: 180, emergency: true, specialties: ["General Medicine", "Orthopedics"], image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80" },
  { name: "Mehrangarh Multispecialty Hospital", city: "Jodhpur", type: "Multi-Specialty", est: 2002, beds: 220, emergency: true, specialties: ["Cardiology", "General Medicine"], image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=80" },
  { name: "Kota Medical College Hospital", city: "Kota", type: "General", est: 1980, beds: 500, emergency: true, specialties: ["General Medicine", "Orthopedics", "Pediatrics"], image: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=900&q=80" },
  { name: "Sukhna Multispecialty Hospital", city: "Chandigarh", type: "Multi-Specialty", est: 1997, beds: 300, emergency: true, specialties: ["Cardiology", "Neurology", "ENT"], image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80" },
];

const facilitiesPool = ["ICU", "Emergency", "Ambulance", "Pharmacy", "Laboratory", "Parking", "Cafeteria", "Blood Bank", "Operation Theatre"];

export const hospitals = base.map((h, i) => {
  const id = `hosp-${i + 1}`;
  const rating = +(3.8 + ((i * 37) % 12) / 10).toFixed(1);
  const reviews = 40 + ((i * 53) % 460);
  return {
    id,
    ...h,
    verified: i % 6 !== 0,
    trustScore: 70 + ((i * 17) % 28),
    rating,
    reviews,
    address: `${12 + i} MG Road, ${h.city}, India`,
    phone: `+91 9${String(100000000 + i * 137).slice(0, 9)}`,
    email: `contact@${h.name.toLowerCase().replace(/[^a-z]+/g, "")}.in`,
    website: `https://www.${h.name.toLowerCase().replace(/[^a-z]+/g, "")}.in`,
    isOpen: i % 5 !== 0,
    facilities: facilitiesPool.filter((_, fi) => (i + fi) % 3 !== 0),
    departments: h.specialties.concat(["Radiology", "Physiotherapy"]).slice(0, 5),
    accreditation: i % 3 === 0 ? "NABH Accredited" : "State Licensed",
    description: `${h.name} is a ${h.type.toLowerCase()} healthcare facility in ${h.city}, established in ${h.est}, known for its ${h.specialties.join(" & ").toLowerCase()} departments and patient-first care model.`,
  };
});

export const getHospitalById = (id) => hospitals.find((h) => h.id === id);
