export const cities = [
  { id: "alwar", name: "Alwar", state: "Rajasthan", hospitals: 24, doctors: 118, clinics: 41, lat: 27.5530, lng: 76.6346, image: "https://images.unsplash.com/photo-1590595195897-6f7f6ee61a6a?w=800&q=80" },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", hospitals: 96, doctors: 512, clinics: 187, lat: 26.9124, lng: 75.7873, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80" },
  { id: "delhi", name: "Delhi", state: "Delhi NCR", hospitals: 210, doctors: 1240, clinics: 430, lat: 28.7041, lng: 77.1025, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80" },
  { id: "gurgaon", name: "Gurgaon", state: "Haryana", hospitals: 88, doctors: 460, clinics: 165, lat: 28.4595, lng: 77.0266, image: "https://images.unsplash.com/photo-1626202373887-2ffb0d3d8b6f?w=800&q=80" },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", hospitals: 245, doctors: 1380, clinics: 512, lat: 19.0760, lng: 72.8777, image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80" },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", hospitals: 102, doctors: 540, clinics: 198, lat: 23.0225, lng: 72.5714, image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80" },
  { id: "udaipur", name: "Udaipur", state: "Rajasthan", hospitals: 31, doctors: 145, clinics: 58, lat: 24.5854, lng: 73.7125, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80" },
  { id: "jodhpur", name: "Jodhpur", state: "Rajasthan", hospitals: 38, doctors: 176, clinics: 63, lat: 26.2389, lng: 73.0243, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80" },
  { id: "kota", name: "Kota", state: "Rajasthan", hospitals: 29, doctors: 132, clinics: 47, lat: 25.2138, lng: 75.8648, image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80" },
  { id: "chandigarh", name: "Chandigarh", state: "Punjab", hospitals: 54, doctors: 298, clinics: 96, lat: 30.7333, lng: 76.7794, image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80" },
];

export const getCityById = (id) => cities.find((c) => c.id === id);
export const getCityByName = (name) => cities.find((c) => c.name === name);
