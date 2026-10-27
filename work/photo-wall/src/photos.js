import imageMeta from "./image-meta.json" with {type: "json"};

// Your real photo collection — change URLs, captions and alt text here.
export const PHOTO_ITEMS = [
  {
    "file": "life-01.png",
    "title": "The collection",
    "alt": "Five illuminated LEGO car display frames above a LEGO Titanic model",
    "collection": "LEGO collection",
    "date": ""
  },
  {
    "file": "soon-1.jpg",
    "title": "Together at SOON",
    "alt": "The SOON Hackathon group together at the event",
    "collection": "SOON Hackathon",
    "date": "May 2026"
  },
  {
    "file": "life-04.png",
    "title": "Built over time",
    "alt": "LEGO cars and Titanic beside cabinets filled with model cars",
    "collection": "LEGO collection",
    "date": ""
  },
  {
    "file": "soon-2.jpg",
    "title": "Building Cortex",
    "alt": "Members of the Cortex team working together at the hackathon",
    "collection": "SOON Hackathon",
    "date": "May 2026"
  },
  {
    "file": "life-05.png",
    "title": "Five favourites",
    "alt": "An angled view of five illuminated LEGO car displays and Titanic",
    "collection": "LEGO collection",
    "date": ""
  },
  {
    "file": "life-06.png",
    "title": "The long way home",
    "alt": "A textured orange sunset over a multi-lane road",
    "collection": "On the road",
    "date": ""
  },
  {
    "file": "soon-3.jpg",
    "title": "Between the coding",
    "alt": "Hackathon participants gathered around a table",
    "collection": "SOON Hackathon",
    "date": "May 2026"
  },
  {
    "file": "life-07.png",
    "title": "Off the pavement",
    "alt": "Red and blue dirt bikes parked on a wooded trail",
    "collection": "Outdoors",
    "date": ""
  },
  {
    "file": "life-08.png",
    "title": "Golden hour",
    "alt": "An orange sunset above a roadway and open fields",
    "collection": "On the road",
    "date": ""
  },
  {
    "file": "soon-4.jpg",
    "title": "A weekend at SOON",
    "alt": "Friends together outdoors during the hackathon weekend",
    "collection": "SOON Hackathon",
    "date": "May 2026"
  },
  {
    "file": "life-09.png",
    "title": "Look up",
    "alt": "An airplane silhouetted against orange clouds beside a tree",
    "collection": "Evenings",
    "date": ""
  },
  {
    "file": "life-10.png",
    "title": "Out on deliveries",
    "alt": "A white delivery truck parked on a leafy city street",
    "collection": "On the road",
    "date": ""
  },
  {
    "file": "life-11.png",
    "title": "After dark",
    "alt": "An illuminated cable-stayed bridge at night, photographed through a vehicle window",
    "collection": "On the road",
    "date": ""
  },
  {
    "file": "life-12.png",
    "title": "By the water",
    "alt": "A rainbow beneath blue sky and clouds above a waterfront boardwalk",
    "collection": "Outdoors",
    "date": ""
  },
  {
    "file": "life-13.png",
    "title": "The way into the city",
    "alt": "Golden sunlight over highway traffic approaching a distant city skyline",
    "collection": "On the road",
    "date": ""
  }
]
  .map((photo,index) => ({...imageMeta[photo.file],...photo,showCaption:/hackathon/i.test(photo.collection || ""),id:photo.id || `photo-${index+1}`}));
