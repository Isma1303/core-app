export interface IDepartmentMember {
    department_member_id: number
    department_id: number
    user_id: number
    reports_to?: number
    is_leader: boolean
}

export interface IDepartmentMemberNew extends Omit<IDepartmentMember, 'department_member_id'> {}
export interface IDepartmentMemberUpdate extends Partial<IDepartmentMember> {}
