import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
  async getAll() {
    await delay(350);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async getByCourseId(courseId) {
    await delay(250);
    return assignments.filter(a => a.courseId === parseInt(courseId)).map(a => ({ ...a }));
  },

  async create(assignmentData) {
    await delay(400);
    const newAssignment = {
      ...assignmentData,
      Id: Math.max(...assignments.map(a => a.Id), 0) + 1,
      courseId: parseInt(assignmentData.courseId)
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index] = { 
      ...assignmentData, 
      Id: parseInt(id),
      courseId: parseInt(assignmentData.courseId)
    };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(200);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    const deleted = assignments.splice(index, 1)[0];
    return { ...deleted };
  },

  async toggleComplete(id) {
    await delay(250);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index].completed = !assignments[index].completed;
    // Clear grade if uncompleting
    if (!assignments[index].completed) {
      assignments[index].grade = null;
    }
    return { ...assignments[index] };
  }
};