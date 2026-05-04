import { Component, OnInit, inject, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-roadmap-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './roadmap-detail.component.html',
  styleUrls: ['./roadmap-detail.component.css']
})
export class RoadmapDetailComponent implements OnInit, AfterViewInit {
  private themeService = inject(ThemeService);
  isDarkMode$ = this.themeService.isDarkMode$;
  
  constructor(private el: ElementRef, private renderer: Renderer2

 , private route: ActivatedRoute
  ) {}

  // المتغير اللي الـ HTML بيقرأ منه
  public activeData: any;
  // السطر 25 بعد التعديل
public traineeAdvantages = [ 
  { text: 'Building a strong and clear foundation that helps you understand the field without confusion.' },
  { text: 'Developing critical thinking and analytical methods to handle real-world problems.' },
  { text: 'Learning with a structured plan where every step is distributed by time and effort.' },
  { text: 'Gradual preparation for transitioning to other paths based on your level and goals.' },
  { text: 'Acquiring practical skills and the ability to implement real-world scenarios.' },
  { text: 'Increasing your job market entry chances through solid foundations and career readiness.' }
];
 
  // الداتا كاملة "بالملي" زي ما بعتها
  allTracks: any = {
    'fundamentals': {
      pathDetails: {
        title: 'Computer Science Fundamentals',
        description: 'Master the core of computing through a systematic and practical approach. Designed for future engineers to build a rock-solid logical foundation.'
      },
      roadmapDetails: [
        { title: 'Level', value: 'Level 01: Core', icon: 'fas fa-layer-group' },
        { title: 'Duration', value: '6 - 9 Months', icon: 'fas fa-clock' },
        { title: 'Projects', value: '15+ Real Projects', icon: 'fas fa-code' },
        { title: 'Certificate', value: 'Professional Track', icon: 'fas fa-certificate' }
      ],
      audienceList: [
        { text: 'Beginners in IT looking for a rock-solid foundation.', icon: 'fas fa-user-graduate' },
        { text: 'Anyone who wants to learn Computer Science from scratch.', icon: 'fas fa-seedling' },
        { text: 'Students who have never studied CS fundamentals before.', icon: 'fas fa-book-reader' },
        { text: 'Professionals looking to switch their career to Software Engineering.', icon: 'fas fa-sync-alt' }
      ],
      contentList: [
        {
          titleEn: 'Logic & Algorithmic Thinking',
          duration: '45',
          points: [
            'Understanding Computational Thinking',
            'Flowcharts & Pseudo-code Standards',
            'Problem Decomposition Strategies',
            'Building your first logical algorithms'
          ]
        },
        {
          titleEn: 'Programming Core (C++/Python)',
          duration: '60',
          points: [
            'Memory Management & Variables',
            'Advanced Control Flow (Loops & Recursion)',
            'Functions & Scope Mechanics',
            'Introduction to OOP Principles'
          ]
        },
        {
          titleEn: 'Data Structures Deep Dive',
          duration: '75',
          points: [
            'Linear Structures (Linked Lists, Stacks, Queues)',
            'Non-Linear Structures (Trees & BST)',
            'Hash Tables & Map Implementations',
            'Graph Theory Fundamentals'
          ]
        },
        {
          titleEn: 'Algorithm Analysis & Design',
          duration: '55',
          points: [
            'Asymptotic Analysis (Big O Notation)',
            'Sorting & Searching Optimization',
            'Divide and Conquer Approach',
            'Greedy Algorithms vs Dynamic Programming'
          ]
        },
        {
          titleEn: 'Computer Systems & OS',
          duration: '50',
          points: [
            'CPU Scheduling & Process Management',
            'Memory Hierarchy & Virtual Memory',
            'File Systems & I/O Operations',
            'Concurrency & Multi-threading Basics'
          ]
        },
        {
          titleEn: 'Database Engine Mechanics',
          duration: '40',
          points: [
            'Relational Model & Algebra',
            'Indexing & Transaction Management',
            'Normalization (1NF to BCNF)',
            'ACID Properties & Recovery'
          ]
        }
      ]
     , benefits: {
      title: 'What will you achieve after this path?',
      items: [
        { title: 'Problem Solver', desc: 'Master the ability to break down complex problems into logical, solvable steps.', icon: 'fas fa-brain' },
        { title: 'Algorithm Expert', desc: 'Write efficient, high-performance code by mastering data structures and algorithms.', icon: 'fas fa-microchip' },
        { title: 'Solid Foundation', desc: 'Ready to learn any programming language or framework with ease and deep understanding.', icon: 'fas fa-chess-knight' }
      ]
    }
    },
    'frontend': {
  pathDetails: {
    title: 'Frontend Web Development Mastery',
    description: 'Elevate your skills from basic coding to building high-performance, industry-standard web applications. Learn the magic behind modern UI/UX.'
  },
  roadmapDetails: [
    { title: 'Level', value: 'Level 02: Professional', icon: 'fas fa-code' },
    { title: 'Duration', value: '5 - 7 Months', icon: 'fas fa-calendar-alt' },
    { title: 'Projects', value: '12+ Production Ready', icon: 'fas fa-laptop-code' },
    { title: 'Certificate', value: 'Certified Frontend Engineer', icon: 'fas fa-award' }
  ],
  audienceList: [
    { text: 'Creative individuals who want to bring designs to life.', icon: 'fas fa-palette' },
    { text: 'Developers looking to master modern frameworks like Angular/React.', icon: 'fas fa-rocket' },
    { text: 'CS Students wanting to bridge the gap between logic and UI.', icon: 'fas fa-graduation-cap' },
    { text: 'UI/UX designers who want to implement their own prototypes.', icon: 'fas fa-pencil-ruler' }
  ],
  contentList: [
    {
      titleEn: 'Advanced HTML5 & Semantic Web',
      duration: '30',
      points: [
        'SEO Fundamentals & Meta Tags',
        'Accessibility (A11Y) Standards',
        'SVG Animation & Optimization',
        'Web Storage API (Local/Session Storage)'
      ]
    },
    {
      titleEn: 'Modern CSS & Layout Systems',
      duration: '45',
      points: [
        'Mastering CSS Grid & Flexbox Layouts',
        'Advanced CSS Variables & Themes',
        'SASS Architecture (7-1 Pattern)',
        'Tailwind CSS & Utility-First Workflow'
      ]
    },
    {
      titleEn: 'JavaScript ES6+ & Beyond',
      duration: '60',
      points: [
        'Functional Programming Concepts',
        'Asynchronous JS (Promises & Async/Await)',
        'Object-Oriented JS & Prototypes',
        'Modules, Bundlers & Vite'
      ]
    },
    {
      titleEn: 'Angular Framework Mastery',
      duration: '80',
      points: [
        'Component Architecture & Lifecycle',
        'RxJS Observables & State Management',
        'Dependency Injection & Services',
        'Directives, Pipes & Custom Decorators'
      ]
    },
    {
      titleEn: 'Frontend Testing & Performance',
      duration: '40',
      points: [
        'Unit Testing with Jasmine & Karma',
        'Core Web Vitals & Optimization',
        'Lazy Loading & Code Splitting',
        'Web Workers & Browser Rendering'
      ]
    },
    {
      titleEn: 'Version Control & Deployment',
      duration: '25',
      points: [
        'Advanced Git (Rebase, Cherry-pick)',
        'CI/CD Pipelines for Frontend',
        'Cloud Hosting (Firebase / Vercel)',
        'Web Performance Monitoring'
      ]
    }
  ],
  benefits: {
      title: 'Your Future as a Frontend Developer',
      items: [
        { title: 'Modern UI Architect', desc: 'Build sophisticated, responsive, and high-performance user interfaces from scratch.', icon: 'fas fa-code' },
        { title: 'Product Showcase', desc: 'Transform creative designs into interactive digital products that users love.', icon: 'fas fa-rocket' },
        { title: 'Industry Ready', desc: 'Master Angular/React ecosystems and professional state management patterns.', icon: 'fas fa-laptop-code' }
      ]
    }
},
'backend': {
    pathDetails: {
      title: 'Backend & Cloud Engineering',
      description: 'The brain of the operation. Learn to build secure, scalable servers, design complex databases, and manage cloud infrastructures.'
    },
    roadmapDetails: [
      { title: 'Level', value: 'Level 03: Expert', icon: 'fas fa-server' },
      { title: 'Duration', value: '7 - 10 Months', icon: 'fas fa-calendar-check' },
      { title: 'Systems', value: '8+ Scalable Systems', icon: 'fas fa-database' },
      { title: 'Cloud', value: 'AWS / Docker / K8s', icon: 'fas fa-cloud' }, // كارت زيادة
      { title: 'Certificate', value: 'Backend Architect', icon: 'fas fa-shield-alt' }
    ],
    audienceList: [
      { text: 'Developers interested in server-side logic and APIs.', icon: 'fas fa-brain' },
      { text: 'Data lovers who want to master system architecture.', icon: 'fas fa-layer-group' },
      { text: 'Security-conscious engineers.', icon: 'fas fa-lock' },
      { text: 'Students aiming for DevOps or Cloud roles.', icon: 'fas fa-network-wired' }
    ],
    contentList: [
      { titleEn: 'Node.js & Express Architecture', duration: '50', points: ['Non-blocking I/O', 'Middleware Pattern', 'Custom CLI Tools', 'Error Handling Strategies'] },
      { titleEn: 'Database Systems Mastery', duration: '65', points: ['Advanced SQL Joins', 'NoSQL Design Patterns', 'Redis Caching', 'Replication & Sharding'] },
      { titleEn: 'Authentication & Microservices', duration: '55', points: ['JWT & OAuth2', 'gRPC & Message Queues', 'Event-Driven Design', 'API Gateways'] },
      { titleEn: 'Infrastructure & DevOps', duration: '70', points: ['Docker & Containerization', 'Kubernetes Basics', 'CI/CD Pipelines', 'Monitoring & Logging (ELK)'] }
    ],
    benefits: {
    title: 'Backend Career Path Outcomes',
    items: [
      { 
        title: 'System Architect', 
        desc: 'Design and implement the logic and structure of massive, high-traffic web applications.', 
        icon: 'fas fa-sitemap' 
      },
      { 
        title: 'Security Expert', 
        desc: 'Master the art of protecting sensitive user data and securing server-to-client communication.', 
        icon: 'fas fa-lock' 
      },
      { 
        title: 'Cloud Specialist', 
        desc: 'Learn to deploy and scale applications on cloud platforms like AWS or Google Cloud.', 
        icon: 'fas fa-cloud' 
      }
    ]
  }
  },
  'mobile': {
    pathDetails: {
      title: 'Cross-Platform Mobile Mastery',
      description: 'Build native-performing apps for iOS and Android from a single codebase using industry-leading frameworks.'
    },
    roadmapDetails: [
      { title: 'Level', value: 'Mid-Senior', icon: 'fas fa-mobile-alt' },
      { title: 'Duration', value: '6 - 9 Months', icon: 'fas fa-clock' },
      { title: 'Apps', value: '6+ Production Apps', icon: 'fas fa-app-store-ios' },
      { title: 'UX', value: 'Mobile Interaction', icon: 'fas fa-fingerprint' }, // كارت زيادة
      { title: 'Certificate', value: 'Mobile Specialist', icon: 'fas fa-award' }
    ],
    audienceList: [
      { text: 'Developers wanting to dominate the App Store.', icon: 'fas fa-mobile' },
      { text: 'Web developers moving to Mobile Development.', icon: 'fas fa-sync' },
      { text: 'Entrepreneurs wanting to build their own MVP.', icon: 'fas fa-lightbulb' }
    ],
    contentList: [
      { titleEn: 'Dart/Kotlin Deep Dive', duration: '40', points: ['Object-Oriented Programming', 'Collections & Generics', 'Async/Await in Mobile', 'Null Safety Mastery'] },
      { titleEn: 'UI/UX & Widget Development', duration: '55', points: ['Custom Animations', 'Responsive Layouts', 'Material & Cupertino', 'Themes & Styles'] },
      { titleEn: 'State Management & Storage', duration: '60', points: ['Bloc / Provider / Riverpod', 'SQLite & Hive', 'Secure Storage', 'Caching Layer'] },
      { titleEn: 'Native Features & Services', duration: '50', points: ['Push Notifications', 'Camera & Biometrics', 'Google Maps API', 'Firebase Integration'] },
      { titleEn: 'Testing & Store Deployment', duration: '30', points: ['Unit & Integration Testing', 'CI/CD for Mobile', 'App Store Guidelines', 'Play Store Publishing'] }
    ],
    benefits: {
    title: 'What will you achieve after this path?',
    items: [
      { 
        title: 'Cross-Platform Expert', 
        desc: 'Build high-performance apps for both iOS and Android from a single codebase.', 
        icon: 'fas fa-clone' 
      },
      { 
        title: 'App Store Ready', 
        desc: 'Master the complete process of deploying professional apps to Google Play and App Store.', 
        icon: 'fas fa-cloud-upload-alt' 
      },
      { 
        title: 'Freelance Mastery', 
        desc: 'Start your career as a freelance mobile developer and build your own startup products.', 
        icon: 'fas fa-hacker-news' 
      }
    ]
  }
  },
  'networking': {
    pathDetails: {
      title: 'Networking & Infrastructure Mastery',
      description: 'Master the backbone of the internet. From Cisco protocols to cloud architecture and network security.'
    },
    roadmapDetails: [
      { title: 'Level', value: 'Foundational to Expert', icon: 'fas fa-network-wired' },
      { title: 'Labs', value: '25+ Virtual Labs', icon: 'fas fa-flask' },
      { title: 'Exams', value: 'CCNA & CCNP Prep', icon: 'fas fa-file-invoice' },
      { title: 'Status', value: 'High Demand', icon: 'fas fa-chart-line' }
    ],
    audienceList: [
      { text: 'Aspiring Network Engineers and Admins.', icon: 'fas fa-user-shield' },
      { text: 'IT professionals moving to Cloud Ops.', icon: 'fas fa-cloud' },
      { text: 'Security enthusiasts focusing on infrastructure.', icon: 'fas fa-lock' }
    ],
    contentList: [
      { titleEn: 'Network Fundamentals (OSI Model)', duration: '40', points: ['TCP/IP vs OSI Layers', 'IPv4 & IPv6 Subnetting', 'Switching & Routing Basics'] },
      { titleEn: 'Cisco Routing & Switching', duration: '70', points: ['VLANs & Trunking', 'STP & EtherChannel', 'OSPF & EIGRP Protocols'] },
      { titleEn: 'Network Security & Firewalls', duration: '55', points: ['Access Control Lists (ACLs)', 'VPN Site-to-Site', 'Intrusion Prevention Systems'] },
      { titleEn: 'Wireless & Automation', duration: '45', points: ['WLAN Architecture', 'Network Programmability', 'Cisco DNA Center Basics'] },
      { titleEn: 'Cloud Networking (AWS/Azure)', duration: '50', points: ['VPC Configuration', 'Load Balancing', 'Direct Connect & ExpressRoute'] }
    ],benefits: {
      title: 'Network & Infrastructure Career Path',
      items: [
        { title: 'Network Engineer', desc: 'Design, implement, and manage secure enterprise-level network infrastructures.', icon: 'fas fa-network-wired' },
        { title: 'Security Specialist', desc: 'Protect data flow and master firewall configurations and security protocols.', icon: 'fas fa-shield-alt' },
        { title: 'Infrastructure Lead', desc: 'Manage servers and cloud connectivity for global organizations.', icon: 'fas fa-server' }
      ]
    }
  },
  'data-science': {
    pathDetails: {
      title: 'Data Science & Artificial Intelligence',
      description: 'Harness the power of AI. Learn to analyze big data, build predictive models, and master Machine Learning.'
    },
    roadmapDetails: [
      { title: 'Math', value: 'Statistics & Algebra', icon: 'fas fa-calculator' },
      { title: 'Tools', value: 'Python / R / SQL', icon: 'fas fa-terminal' },
      { title: 'Projects', value: '10+ Data Case Studies', icon: 'fas fa-project-diagram' },
      { title: 'Certificate', value: 'Data Scientist', icon: 'fas fa-brain' }
    ],
    audienceList: [
      { text: 'Analytical thinkers who love numbers.', icon: 'fas fa-chart-pie' },
      { text: 'Software engineers transitioning to AI.', icon: 'fas fa-robot' },
      { text: 'Researchers needing data-driven insights.', icon: 'fas fa-search-dollar' }
    ],
    contentList: [
      { titleEn: 'Python for Data Analysis', duration: '50', points: ['NumPy & Pandas Mastery', 'Matplotlib & Seaborn', 'Jupyter Notebooks Workflow'] },
      { titleEn: 'Statistics & Probability', duration: '60', points: ['Descriptive Statistics', 'Hypothesis Testing', 'Regression Analysis'] },
      { titleEn: 'Machine Learning Foundations', duration: '80', points: ['Supervised vs Unsupervised', 'Decision Trees & Random Forest', 'Model Evaluation & Tuning'] },
      { titleEn: 'Deep Learning & Neural Networks', duration: '90', points: ['TensorFlow & Keras Basics', 'Computer Vision (CNN)', 'Natural Language Processing'] },
      { titleEn: 'Big Data & Deployment', duration: '45', points: ['Spark & Hadoop Basics', 'Model API Deployment', 'Data Visualization Dashboards'] }
    ],
    benefits: {
      title: 'Mastering Data & Artificial Intelligence',
      items: [
        { title: 'Insight Hunter', desc: 'Extract meaningful patterns from massive datasets to drive business decisions.', icon: 'fas fa-chart-pie' },
        { title: 'ML Practitioner', desc: 'Build and deploy predictive models using advanced machine learning techniques.', icon: 'fas fa-robot' },
        { title: 'AI Innovator', desc: 'Design intelligent systems that mimic human cognitive functions and automate tasks.', icon: 'fas fa-lightbulb' }
      ]
    },
    
    
  },
 
  };

  ngOnInit() {
    // البداية بمسار الـ CS
    this.activeData = this.allTracks['fundamentals'];
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (this.allTracks[id]) {
        this.activeData = this.allTracks[id];
        console.log('Data loaded for:', id); // عشان تتأكد في الـ Console
      }
      window.scrollTo(0, 0); // حركة شياكة عشان يطلع لفوق
    });
  }

  ngAfterViewInit() {
    this.initScrollAnimation();
  }

  switchTrack(trackKey: string) {
    this.activeData = this.allTracks[trackKey];
    // عشان الأنيميشن يشتغل تاني على العناصر الجديدة
    setTimeout(() => {
      this.initScrollAnimation();
    }, 100);
  }

  private initScrollAnimation() {
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'active');
        } else {
          this.renderer.removeClass(entry.target, 'active');
        }
      });
    }, observerOptions);

    const rows = this.el.nativeElement.querySelectorAll('.timeline-row');
    rows.forEach((row: HTMLElement) => observer.observe(row));
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}