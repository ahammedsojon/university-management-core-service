export type IStudent = {
  studentId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  profileImage: string;
  email: string;
  contactNo: string;
  gender: 'male' | 'female';
  bloodGroup: string;
  academicSemesterId: string;
  academicDepartmentId: string;
  academicFacultyId: string;
};

export type IStudentFilter = {
  searchTerm?: string;
};
