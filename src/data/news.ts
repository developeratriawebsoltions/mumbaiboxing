export type NewsItem = {
  id: number;
  title: string;
  date: string;
  category: string;
  location: string;
  summary: string;
  content: string[];
  featured: boolean;
};

export const news: NewsItem[] = [
  {
    id: 1,
    title: "Mumbai Boxing Association Announces New Competitive Season",
    date: "2026-09-01",
    category: "Association Update",
    location: "Mumbai, Maharashtra",
    summary:
      "The Mumbai Boxing Association is preparing for another active competitive season with a focus on athlete development, structured competitions and affiliated clubs.",
    content: [
      "The Mumbai Boxing Association has announced the beginning of a new competitive season for boxers, coaches and affiliated clubs across the region.",
      "The association will continue to focus on grassroots athlete development and provide structured opportunities for boxers to participate in recognized competitions.",
      "Affiliated academies and clubs are encouraged to maintain updated athlete records and follow the association's competition and sporting guidelines.",
      "Further tournament announcements, registration information and official circulars will be published through the association's official communication channels.",
    ],
    featured: true,
  },

  {
    id: 2,
    title: "Affiliated Boxing Clubs Continue Grassroots Athlete Development",
    date: "2026-08-20",
    category: "Athlete Development",
    location: "Mumbai, Maharashtra",
    summary:
      "MBA affiliated academies and clubs continue to play an important role in identifying and developing boxing talent at the grassroots level.",
    content: [
      "Boxing academies affiliated with the Mumbai Boxing Association continue to contribute to the development of young and emerging athletes.",
      "Training centres across different locations provide athletes with opportunities to learn boxing fundamentals, improve their technical abilities and prepare for competitive events.",
      "The association remains committed to strengthening its affiliated club network and creating a structured pathway for athletes from grassroots participation to higher-level competitions.",
    ],
    featured: true,
  },

  {
    id: 3,
    title: "Mumbai Boxing Community Continues to Grow",
    date: "2026-08-10",
    category: "Community",
    location: "Mumbai, Maharashtra",
    summary:
      "The boxing community across Mumbai continues to expand through athletes, coaches, academies and sporting initiatives.",
    content: [
      "The Mumbai boxing community continues to grow with increasing participation from athletes, coaches, academies and sporting stakeholders.",
      "The association aims to encourage a positive sporting environment where athletes can train, compete and develop their skills through organized boxing activities.",
      "MBA will continue working with its affiliated clubs and members to promote boxing and strengthen the sport at the local level.",
    ],
    featured: false,
  },
];