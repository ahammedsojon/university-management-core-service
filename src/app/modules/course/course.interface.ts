export type ICourse = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: {
    courseId: string;
    isDelete?: false | true;
  }[];
};

export type ICourseFilters = {
  searchTerm?: string;
};
