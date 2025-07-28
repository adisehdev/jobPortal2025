const dummyJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Solutions",
    location: "New York, NY",
    type: "Full-time",
    description: "Join our team to develop cutting-edge software solutions."
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Data Insights",
    location: "San Francisco, CA",
    type: "Part-time",
    description: "Analyze data trends and provide actionable insights."
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Creative Agency",
    location: "Remote",
    type: "Contract",
    description: "Design user-friendly interfaces for our web applications."
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "Brand Boosters",
    location: "Chicago, IL",
    type: "Full-time",
    description: "Lead marketing campaigns and drive brand growth."
  },
  {
    id: 5,
    title: "Customer Service Representative",
    company: "CustomerFirst",
    location: "Austin, TX",
    type: "Full-time",
    description: "Provide support to customers via phone and email."
  },
  {
    id: 6,
    title: "Project Manager",
    company: "BuildIt Inc.",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Oversee projects from initiation to delivery."
  },
  {
    id: 7,
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Remote",
    type: "Contract",
    description: "Craft user interfaces and experiences for web apps."
  },
  {
    id: 8,
    title: "DevOps Engineer",
    company: "CloudStream",
    location: "Boston, MA",
    type: "Full-time",
    description: "Implement CI/CD and manage cloud infrastructure."
  },
  {
    id: 9,
    title: "Business Analyst",
    company: "BizAnalytics",
    location: "Denver, CO",
    type: "Part-time",
    description: "Gather requirements and provide business recommendations."
  },
  {
    id: 10,
    title: "Graphic Designer",
    company: "Visionary Labs",
    location: "San Jose, CA",
    type: "Part-time",
    description: "Design compelling visuals and maintain brand identity."
  },
  {
    id: 11,
    title: "IT Support",
    company: "InfoTech",
    location: "Phoenix, AZ",
    type: "Full-time",
    description: "Maintain systems and support employees with tech issues."
  },
  {
    id: 12,
    title: "Sales Executive",
    company: "InnoWorks",
    location: "Dallas, TX",
    type: "Full-time",
    description: "Drive growth by reaching out to potential clients."
  },
  {
    id: 13,
    title: "QA Tester",
    company: "NextGen Tech",
    location: "Detroit, MI",
    type: "Contract",
    description: "Test applications and ensure bug-free user experience."
  },
  {
    id: 14,
    title: "Finance Manager",
    company: "CloudNova",
    location: "Houston, TX",
    type: "Full-time",
    description: "Oversee company finances and budgeting processes."
  },
  {
    id: 15,
    title: "Content Writer",
    company: "WriteRight",
    location: "Remote",
    type: "Part-time",
    description: "Craft engaging blog posts and technical documents."
  },
  {
    id: 16,
    title: "HR Specialist",
    company: "PeopleFirst",
    location: "Miami, FL",
    type: "Full-time",
    description: "Handle recruitment and employee engagement programs."
  },
  {
    id: 17,
    title: "Security Analyst",
    company: "SecureBase",
    location: "Atlanta, GA",
    type: "Full-time",
    description: "Monitor threats and ensure systems are protected."
  },
  {
    id: 18,
    title: "Mobile Developer",
    company: "Appify",
    location: "Remote",
    type: "Contract",
    description: "Develop high-performance mobile applications."
  },
  {
    id: 19,
    title: "Data Scientist",
    company: "Insightful AI",
    location: "Chicago, IL",
    type: "Full-time",
    description: "Build predictive models and drive data strategy."
  },
  {
    id: 20,
    title: "Product Manager",
    company: "Innovatech",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Lead cross-functional teams to deliver product goals."
  },
  {
    id: 21,
    title: "Recruiter",
    company: "TalentHunt",
    location: "Nashville, TN",
    type: "Part-time",
    description: "Source and screen candidates for open roles."
  },
  {
    id: 22,
    title: "Database Administrator",
    company: "DataSecure",
    location: "Austin, TX",
    type: "Full-time",
    description: "Manage database performance and backups."
  },
  {
    id: 23,
    title: "System Administrator",
    company: "SysOps",
    location: "Denver, CO",
    type: "Full-time",
    description: "Ensure reliable infrastructure for daily operations."
  },
  {
    id: 24,
    title: "Full Stack Developer",
    company: "StackedUp",
    location: "San Diego, CA",
    type: "Contract",
    description: "Build and maintain web applications end to end."
  },
  {
    id: 25,
    title: "Marketing Coordinator",
    company: "BrandHive",
    location: "Philadelphia, PA",
    type: "Full-time",
    description: "Assist in campaign planning and market research."
  },
  {
    id: 26,
    title: "Operations Manager",
    company: "Efficio",
    location: "New York, NY",
    type: "Full-time",
    description: "Optimize workflow and increase efficiency."
  },
  {
    id: 27,
    title: "Legal Advisor",
    company: "LawMate",
    location: "Los Angeles, CA",
    type: "Contract",
    description: "Advise on compliance and legal documentation."
  },
  {
    id: 28,
    title: "Customer Success Manager",
    company: "HappyClients",
    location: "Remote",
    type: "Full-time",
    description: "Drive satisfaction and customer retention."
  },
  {
    id: 29,
    title: "Cloud Architect",
    company: "SkyNet Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Design scalable and secure cloud systems."
  },
  {
    id: 30,
    title: "Network Engineer",
    company: "Connectify",
    location: "Houston, TX",
    type: "Full-time",
    description: "Maintain and improve network infrastructure."
  },
  {
    id: 31,
    title: "Research Assistant",
    company: "TechUniversity",
    location: "Boston, MA",
    type: "Part-time",
    description: "Support faculty research projects and data analysis."
  },
  {
    id: 32,
    title: "Game Developer",
    company: "FunStudio",
    location: "Orlando, FL",
    type: "Full-time",
    description: "Build immersive and exciting gaming experiences."
  },
  {
    id: 33,
    title: "Digital Marketer",
    company: "AdBoosters",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Run PPC campaigns and optimize SEO performance."
  },
  {
    id: 34,
    title: "AI Researcher",
    company: "DeepLogic",
    location: "Palo Alto, CA",
    type: "Contract",
    description: "Develop next-gen AI solutions and models."
  },
  {
    id: 35,
    title: "Copywriter",
    company: "Creative Copy",
    location: "Remote",
    type: "Part-time",
    description: "Write compelling ad and landing page copy."
  },
  {
    id: 36,
    title: "Technical Recruiter",
    company: "TechHire",
    location: "Chicago, IL",
    type: "Full-time",
    description: "Hire top engineering and product talent."
  },
  {
    id: 37,
    title: "Virtual Assistant",
    company: "VA Hub",
    location: "Remote",
    type: "Part-time",
    description: "Support administrative tasks for executives."
  },
  {
    id: 38,
    title: "Logistics Coordinator",
    company: "ShipQuick",
    location: "Memphis, TN",
    type: "Full-time",
    description: "Coordinate transportation and supply chain logistics."
  },
  {
    id: 39,
    title: "E-commerce Manager",
    company: "ShopIt",
    location: "Newark, NJ",
    type: "Full-time",
    description: "Manage online store operations and growth."
  },
  {
    id: 40,
    title: "Technical Writer",
    company: "DocuSmart",
    location: "Remote",
    type: "Contract",
    description: "Create documentation for software and APIs."
  },
  {
    id: 41,
    title: "Biomedical Engineer",
    company: "MediTech",
    location: "Cleveland, OH",
    type: "Full-time",
    description: "Work on the development of medical devices."
  },
  {
    id: 42,
    title: "Interior Designer",
    company: "DesignWorks",
    location: "New Orleans, LA",
    type: "Contract",
    description: "Create beautiful and functional spaces for clients."
  },
  {
    id: 43,
    title: "Animation Artist",
    company: "MotionPixels",
    location: "Los Angeles, CA",
    type: "Full-time",
    description: "Animate storyboards and design digital characters."
  },
  {
    id: 44,
    title: "Event Planner",
    company: "Eventify",
    location: "Miami, FL",
    type: "Full-time",
    description: "Organize and execute successful corporate events."
  },
  {
    id: 45,
    title: "Public Relations Specialist",
    company: "BuzzMedia",
    location: "San Francisco, CA",
    type: "Contract",
    description: "Handle media relations and press releases."
  },
  {
    id: 46,
    title: "Legal Intern",
    company: "Law Partners",
    location: "Dallas, TX",
    type: "Internship",
    description: "Assist lawyers with research and documentation."
  },
  {
    id: 47,
    title: "Fitness Trainer",
    company: "FitNation",
    location: "Phoenix, AZ",
    type: "Part-time",
    description: "Guide clients through workouts and training plans."
  },
  {
    id: 48,
    title: "Barista",
    company: "CoffeeCo",
    location: "Portland, OR",
    type: "Part-time",
    description: "Make coffee drinks and provide excellent service."
  },
  {
    id: 49,
    title: "Speech Therapist",
    company: "HealthLink",
    location: "Atlanta, GA",
    type: "Full-time",
    description: "Help clients improve communication abilities."
  },
  {
    id: 50,
    title: "Web Developer",
    company: "DevMasters",
    location: "Remote",
    type: "Full-time",
    description: "Design and build dynamic web applications."
  }
];

export default dummyJobs;