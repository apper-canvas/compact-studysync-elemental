import coursesData from "@/services/mockData/courses.json";

let courses = [...coursesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
  async getAll() {
    await delay(300);
    return [...courses];
  },

  async getById(id) {
    await delay(200);
    const course = courses.find(c => c.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

  async create(courseData) {
    await delay(400);
    const newCourse = {
      ...courseData,
      Id: Math.max(...courses.map(c => c.Id), 0) + 1
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay(300);
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    courses[index] = { ...courseData, Id: parseInt(id) };
    return { ...courses[index] };
  },

  async delete(id) {
    await delay(200);
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    const deleted = courses.splice(index, 1)[0];
    return { ...deleted };
  }
};