export interface IUserDepartment {
    department_id: number
    user_id: number
}

export interface IUserDepartmentNew extends Omit<IUserDepartment, ''> {}
export interface IUserDepartmentUpdate extends Partial<IUserDepartment> {}
