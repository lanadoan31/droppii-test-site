// Mock data for the admin panel prototype
const MOCK = {
  user: { name: 'An Nguyễn', email: 'an@droppii.vn', initials: 'AN', role: 'Admin' },

  tests: [
    { id: 't1', title: 'Seller Onboarding Assessment', category: 'Onboarding', skillLevel: 'Beginner', status: 'published',
      questions: 24, duration: 30, attempts: 1247, avgScore: 78, passRate: 84, updated: '2 hours ago' },
    { id: 't2', title: 'Product Listing Quality Test', category: 'Listings', skillLevel: 'Beginner', status: 'published',
      questions: 18, duration: 25, attempts: 892, avgScore: 71, passRate: 68, updated: 'Yesterday' },
    { id: 't3', title: 'Customer Service Standards', category: 'Service', skillLevel: 'Intermediate', status: 'draft',
      questions: 30, duration: 45, attempts: 0, avgScore: 0, passRate: 0, updated: '3 days ago' },
    { id: 't4', title: 'Logistics & Shipping Knowledge', category: 'Operations', skillLevel: 'Intermediate', status: 'published',
      questions: 22, duration: 35, attempts: 654, avgScore: 82, passRate: 91, updated: '1 week ago' },
    { id: 't5', title: 'Platform Policies Quiz (2026 update)', category: 'Compliance', skillLevel: 'Advanced', status: 'scheduled',
      questions: 15, duration: 20, attempts: 0, avgScore: 0, passRate: 0, updated: '4 days ago' },
    { id: 't6', title: 'Marketing Tools Proficiency', category: 'Marketing', skillLevel: 'Intermediate', status: 'draft',
      questions: 12, duration: 20, attempts: 0, avgScore: 0, passRate: 0, updated: '2 weeks ago' },
    { id: 't7', title: 'Returns & Refunds Procedure', category: 'Service', skillLevel: 'Beginner', status: 'archived',
      questions: 16, duration: 25, attempts: 412, avgScore: 74, passRate: 79, updated: '1 month ago' },
    { id: 't8', title: 'Live Stream Selling Basics', category: 'Marketing', skillLevel: 'Advanced', status: 'published',
      questions: 20, duration: 30, attempts: 538, avgScore: 69, passRate: 65, updated: '5 days ago' },
  ],

  questionBank: [
    { id: 'q1', text: 'What is the maximum file size for product images on Droppii?', type: 'multiple-choice', difficulty: 'Easy', usedIn: 3 },
    { id: 'q2', text: 'A customer requests a return after 14 days. What is the correct policy?', type: 'multiple-choice', difficulty: 'Medium', usedIn: 2 },
    { id: 'q3', text: 'Describe the steps for setting up a flash sale.', type: 'short-answer', difficulty: 'Hard', usedIn: 1 },
    { id: 'q4', text: 'Match each shipping tier to its delivery time.', type: 'matching', difficulty: 'Medium', usedIn: 2 },
    { id: 'q5', text: 'Sellers must respond to customer messages within ___ hours.', type: 'fill-blank', difficulty: 'Easy', usedIn: 4 },
    { id: 'q6', text: 'Which of the following are prohibited product categories? (Select all)', type: 'multi-select', difficulty: 'Medium', usedIn: 2 },
    { id: 'q7', text: 'True or false: All product reviews must be moderated within 24 hours.', type: 'true-false', difficulty: 'Easy', usedIn: 1 },
    { id: 'q8', text: 'Calculate the seller commission for a product priced at 500,000 VND in the Electronics category.', type: 'short-answer', difficulty: 'Hard', usedIn: 0 },
  ],

  takers: [
    { id: 'u1', name: 'Linh Pham', email: 'linh.p@shop.vn', store: 'Linh Beauty Store', score: 92, status: 'pass', date: '2 hours ago', duration: '24:13', avatar: 'LP', color: '#1F6FEB' },
    { id: 'u2', name: 'Minh Tran', email: 'minh.tran@gmail.com', store: 'Minh Electronics', score: 67, status: 'fail', date: '3 hours ago', duration: '29:48', avatar: 'MT', color: '#F26522' },
    { id: 'u3', name: 'Hoa Le', email: 'hoa.le.shop@yahoo.com', store: 'Hoa Fashion HCM', score: 88, status: 'pass', date: '5 hours ago', duration: '21:07', avatar: 'HL', color: '#2FA967' },
    { id: 'u4', name: 'Duc Vu', email: 'ducvu89@gmail.com', store: 'Duc Home & Living', score: 75, status: 'pass', date: 'Yesterday', duration: '27:32', avatar: 'DV', color: '#8B6F4E' },
    { id: 'u5', name: 'Anh Nguyen', email: 'anh.n@store.vn', store: 'Anh Mom & Baby', score: 95, status: 'pass', date: 'Yesterday', duration: '19:45', avatar: 'AN', color: '#9333EA' },
    { id: 'u6', name: 'Tuan Hoang', email: 'tuan.h@gmail.com', store: 'Tuan Sports Gear', score: 58, status: 'fail', date: '2 days ago', duration: '30:00', avatar: 'TH', color: '#DC2A2A' },
    { id: 'u7', name: 'Mai Pham', email: 'mai.pham@droppii.vn', store: 'Mai Wellness', score: 81, status: 'pass', date: '2 days ago', duration: '23:18', avatar: 'MP', color: '#1F6FEB' },
    { id: 'u8', name: 'Khanh Do', email: 'khanh@store.com', store: 'Khanh Pet Supplies', score: 72, status: 'pass', date: '3 days ago', duration: '26:55', avatar: 'KD', color: '#F5C44A' },
  ],

  completionsTrend: [
    { day: 'Apr 24', completions: 32, avgScore: 71 }, { day: 'Apr 25', completions: 45, avgScore: 74 },
    { day: 'Apr 26', completions: 28, avgScore: 69 }, { day: 'Apr 27', completions: 51, avgScore: 76 },
    { day: 'Apr 28', completions: 67, avgScore: 78 }, { day: 'Apr 29', completions: 73, avgScore: 75 },
    { day: 'Apr 30', completions: 89, avgScore: 80 }, { day: 'May 1',  completions: 62, avgScore: 77 },
    { day: 'May 2',  completions: 58, avgScore: 73 }, { day: 'May 3',  completions: 71, avgScore: 79 },
    { day: 'May 4',  completions: 95, avgScore: 81 }, { day: 'May 5',  completions: 84, avgScore: 78 },
    { day: 'May 6',  completions: 102, avgScore: 82 }, { day: 'May 7',  completions: 76, avgScore: 79 },
  ],

  scoreDistribution: [
    { range: '0–20',  count: 12 }, { range: '21–40', count: 38 },
    { range: '41–60', count: 124 }, { range: '61–80', count: 487 },
    { range: '81–100', count: 586 },
  ],

  builderQuestions: [
    { id: 'bq1', type: 'multiple-choice', text: 'What is the maximum number of product images you can upload per listing?',
      options: ['Up to 5 images', 'Up to 8 images', 'Up to 12 images', 'Unlimited'], correct: [1], points: 5 },
    { id: 'bq2', type: 'multiple-choice', text: 'Which payment methods are supported by default for new sellers?',
      options: ['Bank transfer only', 'Cash on delivery only', 'Bank transfer + COD + e-wallets', 'E-wallets only'], correct: [2], points: 5 },
    { id: 'bq3', type: 'true-false', text: 'Sellers can edit product titles after a listing has been published.',
      options: ['True', 'False'], correct: [0], points: 3 },
    { id: 'bq4', type: 'multi-select', text: 'Which of the following are required when creating a new product? (Select all that apply)',
      options: ['Product title', 'At least 1 image', 'Detailed description', 'Customer reviews', 'Stock quantity'], correct: [0, 1, 2, 4], points: 6 },
    { id: 'bq5', type: 'short-answer', text: 'In your own words, describe the steps to apply for a verified seller badge.',
      options: [], correct: [], points: 8 },
  ],

  activity: [
    { who: 'Linh Pham', what: 'completed', target: 'Seller Onboarding Assessment', score: 92, when: '2m ago' },
    { who: 'Minh Tran', what: 'completed', target: 'Product Listing Quality', score: 67, when: '14m ago' },
    { who: 'You', what: 'published', target: 'Live Stream Selling Basics', score: null, when: '1h ago' },
    { who: 'Hoa Le', what: 'completed', target: 'Logistics & Shipping', score: 88, when: '2h ago' },
    { who: 'Mai Pham', what: 'completed', target: 'Seller Onboarding Assessment', score: 81, when: '3h ago' },
    { who: 'You', what: 'edited', target: 'Customer Service Standards', score: null, when: '5h ago' },
    { who: 'Tuan Hoang', what: 'failed', target: 'Logistics & Shipping', score: 58, when: '6h ago' },
  ],
};

window.MOCK = MOCK;
