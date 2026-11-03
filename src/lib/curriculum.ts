import type { CourseMeta, TopicMeta } from "./types";

function lesson(
  lessonNumber: number,
  slug: string,
  title: string,
  summary: string,
  status: TopicMeta["status"] = "stub",
): TopicMeta {
  return { lessonNumber, slug, title, summary, status };
}

export const courses: CourseMeta[] = [
  {
    id: "math1",
    title: "Integrated Math 1",
    shortTitle: "Math 1",
    description:
      "Built around your class textbook: sequences, linear & exponential functions, equations, systems, geometry, and data.",
    units: [
      {
        slug: "unit-1",
        title: "Unit 1 · Sequences",
        description:
          "See patterns in diagrams, then model arithmetic and geometric sequences with tables, graphs, and equations.",
        pdf: "/textbook/math1/unit-1.pdf",
        topics: [
          lesson(1, "checkerboard-borders", "Checkerboard Borders", "Use variables to describe pattern counting.", "ready"),
          lesson(2, "growing-dots", "Growing Dots", "Model arithmetic sequences with tables, graphs, and equations.", "ready"),
          lesson(3, "growing-growing-dots", "Growing, Growing Dots", "Model geometric sequences with a common ratio.", "ready"),
          lesson(4, "scotts-workout", "Scott’s Workout", "Identify arithmetic growth in a real-world workout story.", "ready"),
          lesson(5, "dont-break-the-chain", "Don’t Break the Chain", "Write recursive and explicit equations with function notation.", "ready"),
          lesson(6, "home-on-the-range", "Home on the Range", "Connect sequences to domain and range ideas.", "ready"),
          lesson(7, "what-comes-next", "What Comes Next? What Comes Later?", "Describe growth patterns for arithmetic and geometric sequences.", "ready"),
          lesson(8, "what-does-it-mean", "What Does It Mean?", "Find missing terms in arithmetic sequences.", "ready"),
          lesson(9, "geometric-meanies", "Geometric Meanies", "Find missing terms in geometric sequences.", "ready"),
          lesson(10, "i-know-what-do-you-know", "I Know; What Do You Know?", "Efficiently identify and represent sequence types.", "ready"),
        ],
      },
      {
        slug: "unit-2",
        title: "Unit 2 · Linear & Exponential Functions",
        description:
          "Compare discrete vs continuous models and connect sequences to linear and exponential function families.",
        pdf: "/textbook/math1/unit-2.pdf",
        topics: [
          lesson(1, "piggies-and-pools", "Piggies and Pools", "Compare linear and exponential growth in story contexts.", "ready"),
          lesson(2, "shh-please-be-discreet", "Shh! Please Be Discreet (Discrete)!", "Choose discrete or continuous representations.", "ready"),
          lesson(3, "the-name-game", "The Name Game", "Connect naming conventions to function features.", "ready"),
          lesson(4, "the-in-betweeners", "The In-Betweeners", "Fill in values between known points on linear/exponential models.", "ready"),
          lesson(5, "twin-powers", "Twin Powers", "Compare related exponential situations.", "ready"),
          lesson(6, "half-interested", "Half Interested or More Interesting", "Investigate half-life style exponential change.", "ready"),
        ],
      },
      {
        slug: "unit-3",
        title: "Unit 3 · Features of Functions",
        description:
          "Read key features from graphs and contexts: intercepts, rates, and function behavior over intervals.",
        pdf: "/textbook/math1/unit-3.pdf",
        topics: [
          lesson(1, "getting-ready-pool-party", "Getting Ready for a Pool Party", "Interpret features of functions in context.", "ready"),
          lesson(2, "floating-down-the-river", "Floating Down the River", "Connect graphs to real motion stories.", "ready"),
          lesson(3, "function-junction", "Function Junction", "Identify and describe function relationships.", "ready"),
          lesson(4, "water-wonderland", "Water Wonderland", "Analyze piecewise / changing rates in context.", "ready"),
          lesson(5, "give-me-five", "Give Me Five", "Practice reading multiple representations.", "ready"),
          lesson(6, "another-day", "Another Day", "Synthesize function features across representations.", "ready"),
        ],
      },
      {
        slug: "unit-4",
        title: "Unit 4 · Equations & Inequalities",
        description:
          "Solve equations and inequalities, including literal equations and comparing sides of a relationship.",
        pdf: "/textbook/math1/unit-4.pdf",
        topics: [
          lesson(1, "cafeteria-actions", "Cafeteria Actions and Reactions", "Connect actions on equations to balancing stories.", "ready"),
          lesson(2, "elviras-equations", "Elvira’s Equations", "Solve linear equations with clear inverse-operation steps.", "ready"),
          lesson(3, "solving-equations-literally", "Solving Equations Literally", "Rearrange literal equations for a chosen variable.", "ready"),
          lesson(4, "greater-than", "Greater Than?", "Solve and interpret linear inequalities.", "ready"),
          lesson(5, "may-i-have-more", "May I Have More, Please?", "Model inequality situations from context.", "ready"),
          lesson(6, "taking-sides", "Taking Sides", "Compare expressions and justify inequality reasoning.", "ready"),
        ],
      },
      {
        slug: "unit-5",
        title: "Unit 5 · Systems of Equations & Inequalities",
        description:
          "Model business and pet-sitting constraints with systems, then solve graphically and algebraically.",
        pdf: "/textbook/math1/unit-5.pdf",
        topics: [
          lesson(1, "business-cents", "Business Cents", "Set up systems from business contexts.", "ready"),
          lesson(2, "pet-sitters", "Pet Sitters", "Solve systems that model service constraints.", "ready"),
          lesson(3, "too-big-or-not", "Too Big or Not Too Big, That Is the Question", "Use inequalities with systems.", "ready"),
          lesson(4, "some-of-one", "Some of One, None of the Other", "Interpret special system cases.", "ready"),
          lesson(5, "pampering-and-feeding", "Pampering and Feeding Time", "Apply systems to scheduling/resource stories.", "ready"),
          lesson(6, "all-for-one", "All for One, One for All", "Synthesize system strategies.", "ready"),
        ],
      },
      {
        slug: "unit-6",
        title: "Unit 6 · Transformations & Symmetry",
        description:
          "Use rigid motions and symmetry to understand congruence relationships on the plane.",
        pdf: "/textbook/math1/unit-6.pdf",
        topics: [
          lesson(1, "leaping-lizards", "Leaping Lizards!", "Explore transformations with figures.", "ready"),
          lesson(2, "is-it-right", "Is It Right?", "Connect transformations to right-angle / orientation ideas.", "ready"),
          lesson(3, "leap-frog", "Leap Frog", "Compose transformations.", "ready"),
          lesson(4, "leap-year", "Leap Year", "Analyze reflection relationships.", "ready"),
          lesson(5, "symmetries-of-quadrilaterals", "Symmetries of Quadrilaterals", "Classify figures by symmetry.", "ready"),
        ],
      },
      {
        slug: "unit-7",
        title: "Unit 7 · Congruence, Construction & Proof",
        description:
          "Construct figures and use congruence criteria to justify geometric relationships.",
        pdf: "/textbook/math1/unit-7.pdf",
        topics: [
          lesson(1, "under-construction", "Under Construction", "Build geometric figures with tools and reasoning.", "ready"),
          lesson(2, "more-under-construction", "More Things Under Construction", "Extend construction strategies.", "ready"),
          lesson(3, "can-you-get-there", "Can You Get There From Here?", "Connect transformations to congruence.", "ready"),
          lesson(4, "congruent-triangles", "Congruent Triangles", "Use triangle congruence criteria.", "ready"),
          lesson(5, "congruent-triangles-rescue", "Congruent Triangles to the Rescue", "Apply congruence in proofs and problems.", "ready"),
        ],
      },
      {
        slug: "unit-8",
        title: "Unit 8 · Connecting Algebra & Geometry",
        description:
          "Use distance, midpoints, and slope to prove geometric facts with algebra.",
        pdf: "/textbook/math1/unit-8.pdf",
        topics: [
          lesson(1, "go-the-distance", "Go the Distance", "Use the distance formula on the coordinate plane.", "ready"),
          lesson(2, "yard-work-in-segments", "Yard Work in Segments", "Work with midpoints and segment relationships.", "ready"),
          lesson(3, "slippery-slopes", "Slippery Slopes", "Connect slope to parallel and perpendicular lines.", "ready"),
          lesson(4, "prove-it-with-algebra", "Prove It with Algebra", "Write coordinate proofs.", "ready"),
        ],
      },
      {
        slug: "unit-9",
        title: "Unit 9 · Modeling Data",
        description:
          "Organize data, make comparisons, and model relationships from two-way tables and scatter trends.",
        pdf: "/textbook/math1/unit-9.pdf",
        topics: [
          lesson(1, "connect-the-dots", "Connect the Dots", "Explore scatterplots and associations.", "ready"),
          lesson(6, "food-for-thought", "Food for Thought", "Interpret data stories and measures.", "ready"),
          lesson(7, "bridging-the-gap", "Bridging the Gap", "Compare distributions and gaps in data.", "ready"),
          lesson(8, "making-the-grade", "Making the Grade", "Analyze categorical/quantitative grade data.", "ready"),
          lesson(9, "two-way-streets", "Two-Way Streets", "Read and interpret two-way frequency tables.", "ready"),
        ],
      },
    ],
  },
  {
    id: "math2",
    title: "Integrated Math 2",
    shortTitle: "Math 2",
    description:
      "Built around your Math 2 textbook: quadratic functions, transforming expressions, and solving quadratics.",
    units: [
      {
        slug: "unit-1",
        title: "Unit 1 · Quadratic Functions",
        description:
          "Recognize quadratic growth, compare to linear/exponential, and model area and race contexts.",
        pdf: "/textbook/math2/unit-1.pdf",
        topics: [
          lesson(1, "something-to-talk-about", "Something to Talk About", "Identify quadratic patterns from figures and tables.", "ready"),
          lesson(2, "i-rule", "I Rule!", "Compare linear and quadratic models side by side.", "ready"),
          lesson(3, "scotts-muscle-march", "Scott’s Muscle March", "Build quadratics from cumulative arithmetic totals.", "ready"),
          lesson(4, "rabbit-run", "Rabbit Run", "Maximize area with a fixed perimeter using a quadratic model.", "ready"),
          lesson(5, "tortoise-and-hare", "The Tortoise and the Hare", "Compare quadratic and exponential growth.", "ready"),
          lesson(6, "be-the-change", "Be the Change", "Analyze rates of change for quadratic functions.", "ready"),
        ],
      },
      {
        slug: "unit-2",
        title: "Unit 2 · Structures of Expressions",
        description:
          "Transform quadratics, complete the square, and move fluently between factored, vertex, and standard forms.",
        pdf: "/textbook/math2/unit-2.pdf",
        topics: [
          lesson(1, "transformers-shifty-ys", "Transformers: Shifty y’s", "Shift quadratic graphs vertically and horizontally.", "ready"),
          lesson(2, "transformers-more-than-meets", "Transformers: More Than Meets the y’s", "Stretch and reflect quadratic graphs.", "ready"),
          lesson(3, "building-the-perfect-square", "Building the Perfect Square", "Complete the square with area models.", "ready"),
          lesson(4, "square-deal", "Square Deal", "Rewrite quadratics into vertex form.", "ready"),
          lesson(5, "be-there-or-be-square", "Be There or Be Square", "Connect completed-square form to graph features.", "ready"),
          lesson(9, "lining-up-quadratics", "Lining Up Quadratics", "Match equations to graphs and key features.", "ready"),
          lesson(10, "ive-got-a-fill-in", "I’ve Got a Fill-in", "Fill missing parameters across quadratic forms.", "ready"),
        ],
      },
      {
        slug: "unit-3",
        title: "Unit 3 · Solving Quadratics & Complex Numbers",
        description:
          "Solve by graphing, factoring, completing the square, and the quadratic formula — including complex solutions.",
        pdf: "/textbook/math2/unit-3.pdf",
        topics: [
          lesson(1, "all-things-being-equal", "All Things Being Equal", "Solve quadratics by factoring, roots, and completing the square.", "ready"),
          lesson(2, "formula-for-success", "Formula for Success", "Derive and use the quadratic formula.", "ready"),
          lesson(3, "comparison-shopping", "Comparison Shopping", "Choose an efficient solving method.", "ready"),
          lesson(4, "to-be-determined", "To Be Determined", "Use the discriminant to predict solution types.", "ready"),
          lesson(5, "irrational-but-imaginary", "I May Be Irrational, But You’re Imaginary", "Extend to non-real solutions.", "ready"),
          lesson(6, "inumbers", "iNumbers", "Operate with imaginary and complex numbers.", "ready"),
        ],
      },
    ],
  },
];

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId);
}

export function getUnit(courseId: string, unitSlug: string) {
  return getCourse(courseId)?.units.find((unit) => unit.slug === unitSlug);
}

export function getTopic(courseId: string, unitSlug: string, topicSlug: string) {
  return getUnit(courseId, unitSlug)?.topics.find((topic) => topic.slug === topicSlug);
}

export function topicPath(courseId: string, unitSlug: string, topicSlug: string) {
  return `/${courseId}/${unitSlug}/${topicSlug}`;
}
