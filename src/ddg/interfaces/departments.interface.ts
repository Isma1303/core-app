export interface IDepartments {
    department_id: number;
    department_nm: string;
    is_active: boolean;
}

export interface IDepartmentsNew extends Omit<IDepartments, 'department_id'> { }
export interface IDepartmentsUpdate extends Partial<IDepartments> { }