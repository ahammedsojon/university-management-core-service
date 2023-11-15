export type IFaculty = {
  facultyId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  profileImage: string;
  email: string;
  contactNo: string;
  gender: 'male' | 'female';
  bloodGroup: string;
  designation: string;
  academicDepartmentId: string;
  academicFacultyId: string;
};

export type IFacultyFilter = {
  searchTerm?: string;
};
