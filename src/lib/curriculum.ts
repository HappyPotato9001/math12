import type { CourseMeta } from "./types";

export const courses: CourseMeta[] = [
  {
    id: "math1",
    title: "Integrated Math 1",
    shortTitle: "Math 1",
    description:
      "Linear thinking, systems, exponents, geometry foundations, and data — the backbone of the pathway.",
    units: [
      {
        slug: "expressions-equations",
        title: "Expressions & Equations",
        description: "Simplify, solve, and check linear equations with purpose.",
        topics: [
          {
            slug: "solving-linear",
            title: "Solving Linear Equations",
            summary: "Isolate the variable with inverse operations and check solutions.",
            status: "ready",
          },
          {
            slug: "inequalities",
            title: "Linear Inequalities",
            summary: "Solve and graph one-variable inequalities.",
            status: "ready",
          },
        ],
      },
      {
        slug: "linear-functions",
        title: "Linear Functions",
        description: "Rate of change, intercepts, and modeling with lines.",
        topics: [
          {
            slug: "slope-intercept",
            title: "Slope-Intercept Form",
            summary: "Read and write $y = mx + b$ from graphs, tables, and stories.",
            status: "ready",
          },
          {
            slug: "writing-equations",
            title: "Writing Linear Equations",
            summary: "Build equations from two points or a point and slope.",
            status: "stub",
          },
        ],
      },
      {
        slug: "systems",
        title: "Systems of Equations",
        description: "Find the intersection that satisfies two constraints at once.",
        topics: [
          {
            slug: "substitution",
            title: "Solving by Substitution",
            summary: "Replace a variable and solve the resulting one-variable equation.",
            status: "stub",
          },
        ],
      },
      {
        slug: "exponentials",
        title: "Exponential Relationships",
        description: "Growth and decay with a constant multiplier.",
        topics: [
          {
            slug: "exponential-growth",
            title: "Exponential Growth & Decay",
            summary: "Recognize and evaluate $y = a \\cdot b^x$ models.",
            status: "stub",
          },
        ],
      },
      {
        slug: "geometry-foundations",
        title: "Geometry Foundations",
        description: "Congruence, rigid motions, and precise language for figures.",
        topics: [
          {
            slug: "congruence",
            title: "Congruence Basics",
            summary: "Corresponding parts and rigid motion arguments.",
            status: "stub",
          },
        ],
      },
      {
        slug: "data-statistics",
        title: "Data & Statistics",
        description: "Center, spread, and comparing distributions.",
        topics: [
          {
            slug: "center-spread",
            title: "Center & Spread",
            summary: "Mean, median, and IQR for real data sets.",
            status: "stub",
          },
        ],
      },
    ],
  },
  {
    id: "math2",
    title: "Integrated Math 2",
    shortTitle: "Math 2",
    description:
      "Quadratics, similarity, trig, circles, and probability — where algebra and geometry lock together.",
    units: [
      {
        slug: "quadratics",
        title: "Quadratic Functions",
        description: "Parabolas, factoring, and solving for zeros.",
        topics: [
          {
            slug: "factoring-quadratics",
            title: "Factoring Quadratics",
            summary: "Factor $ax^2 + bx + c$ and connect factors to roots.",
            status: "ready",
          },
          {
            slug: "vertex-form",
            title: "Vertex Form",
            summary: "Rewrite and graph from $y = a(x - h)^2 + k$.",
            status: "ready",
          },
        ],
      },
      {
        slug: "polynomials",
        title: "Polynomial & Rational Expressions",
        description: "Operate on polynomials and simplify rational expressions.",
        topics: [
          {
            slug: "polynomial-ops",
            title: "Polynomial Operations",
            summary: "Add, subtract, and multiply polynomials carefully.",
            status: "stub",
          },
        ],
      },
      {
        slug: "similarity-trig",
        title: "Similarity & Right-Triangle Trig",
        description: "Scale figures and use sine, cosine, and tangent.",
        topics: [
          {
            slug: "right-triangle-trig",
            title: "Right-Triangle Trig",
            summary: "SOH-CAH-TOA for missing sides and angles.",
            status: "ready",
          },
        ],
      },
      {
        slug: "circles-volume",
        title: "Circles & Volume",
        description: "Arc measures, sector area, and 3D volume formulas.",
        topics: [
          {
            slug: "circle-basics",
            title: "Circle Basics",
            summary: "Central angles, arcs, and circumference relationships.",
            status: "stub",
          },
        ],
      },
      {
        slug: "probability",
        title: "Probability",
        description: "Compound events and conditional probability.",
        topics: [
          {
            slug: "compound-events",
            title: "Compound Events",
            summary: "And/or rules for independent and dependent events.",
            status: "stub",
          },
        ],
      },
      {
        slug: "modeling",
        title: "Functions & Modeling",
        description: "Choose models and interpret parameters in context.",
        topics: [
          {
            slug: "choosing-models",
            title: "Choosing Models",
            summary: "Decide between linear and quadratic fits.",
            status: "stub",
          },
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
