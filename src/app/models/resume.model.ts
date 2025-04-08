export interface Education {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description?: string;
}
  
export interface Experience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    technologies: string[];
}
  
export interface Skill {
    name: string;
    level: number; // 1-5
    category: string;
}
  
export interface Resume {
    education: Education[];
    experience: Experience[];
    skills: Skill[];
    languages: { name: string, proficiency: string }[];
    certifications: { name: string, issuer: string, date: string }[];
}