import { storage } from "./storage";
import * as schema from "@shared/schema";

export async function seedHRMSData() {
  console.log("🏢 Starting HRMS data seeding...");

  try {
    // Create sample employees with proper schema field names
    const employees = [
      {
        employeeId: 'EMP001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@company.com',
        phone: '+1-555-0101',
        department: 'engineering' as const,
        position: 'Senior Software Engineer',
        jobTitle: 'Senior Software Engineer',
        hireDate: new Date('2023-01-15'),
        salary: '95000.00',
        status: 'active' as const,
        workLocation: 'office',
        annualLeaveBalance: '25',
        sickLeaveBalance: '10',
        personalLeaveBalance: '5',
        emergencyContactName: 'John Johnson',
        emergencyContactPhone: '+1-555-0102',
        address: '123 Main St, San Francisco, CA 94102'
      },
      {
        employeeId: 'EMP002',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@company.com',
        phone: '+1-555-0201',
        department: 'marketing' as const,
        position: 'Marketing Manager',
        jobTitle: 'Marketing Manager',
        hireDate: new Date('2022-08-20'),
        salary: '78000.00',
        status: 'active' as const,
        workLocation: 'hybrid',
        annualLeaveBalance: '22',
        sickLeaveBalance: '8',
        personalLeaveBalance: '3',
        emergencyContactName: 'Lisa Chen',
        emergencyContactPhone: '+1-555-0202',
        address: '456 Oak Ave, Oakland, CA 94601'
      },
      {
        employeeId: 'EMP003',
        firstName: 'Jennifer',
        lastName: 'Williams',
        email: 'jennifer.williams@company.com',
        phone: '+1-555-0301',
        department: 'marketing' as const,
        position: 'VP of Marketing',
        jobTitle: 'VP of Marketing',
        hireDate: new Date('2021-03-10'),
        salary: '125000.00',
        status: 'active' as const,
        workLocation: 'office',
        annualLeaveBalance: '30',
        sickLeaveBalance: '12',
        personalLeaveBalance: '8',
        emergencyContactName: 'Robert Williams',
        emergencyContactPhone: '+1-555-0302',
        address: '789 Pine St, San Francisco, CA 94103'
      },
      {
        employeeId: 'EMP004',
        firstName: 'David',
        lastName: 'Rodriguez',
        email: 'david.rodriguez@company.com',
        phone: '+1-555-0401',
        department: 'engineering' as const,
        position: 'Engineering Manager',
        jobTitle: 'Engineering Manager',
        hireDate: new Date('2020-11-05'),
        salary: '135000.00',
        status: 'active' as const,
        workLocation: 'office',
        annualLeaveBalance: '28',
        sickLeaveBalance: '10',
        personalLeaveBalance: '6',
        emergencyContactName: 'Maria Rodriguez',
        emergencyContactPhone: '+1-555-0402',
        address: '321 Elm St, Berkeley, CA 94702'
      },
      {
        employeeId: 'EMP005',
        firstName: 'Amanda',
        lastName: 'Taylor',
        email: 'amanda.taylor@company.com',
        phone: '+1-555-0501',
        department: 'hr' as const,
        position: 'HR Specialist',
        jobTitle: 'HR Specialist',
        hireDate: new Date('2023-06-12'),
        salary: '65000.00',
        status: 'active' as const,
        workLocation: 'office',
        annualLeaveBalance: '20',
        sickLeaveBalance: '10',
        personalLeaveBalance: '5',
        emergencyContactName: 'James Taylor',
        emergencyContactPhone: '+1-555-0502',
        address: '654 Cedar Dr, San Jose, CA 95112'
      },
      {
        employeeId: 'EMP006',
        firstName: 'Robert',
        lastName: 'Brown',
        email: 'robert.brown@company.com',
        phone: '+1-555-0601',
        department: 'hr' as const,
        position: 'HR Director',
        jobTitle: 'HR Director',
        hireDate: new Date('2019-04-08'),
        salary: '110000.00',
        status: 'active' as const,
        workLocation: 'office',
        annualLeaveBalance: '28',
        sickLeaveBalance: '12',
        personalLeaveBalance: '7',
        emergencyContactName: 'Susan Brown',
        emergencyContactPhone: '+1-555-0602',
        address: '987 Maple Ln, Palo Alto, CA 94301'
      }
    ];

    // Create employees
    const createdEmployees = [];
    for (const employee of employees) {
      try {
        const created = await storage.createEmployee(employee);
        createdEmployees.push(created);
        console.log(`✅ Created employee: ${created.firstName} ${created.lastName}`);
      } catch (error) {
        console.log(`⚠️  Employee ${employee.firstName} ${employee.lastName} might already exist`);
      }
    }

    // Create sample attendance records
    const attendanceRecords = [
      {
        employeeId: 'EMP001',
        date: new Date('2025-01-24'),
        clockIn: new Date('2025-01-24T09:00:00'),
        clockOut: new Date('2025-01-24T17:30:00'),
        hoursWorked: 8.5,
        status: 'present' as const,
        location: 'office'
      },
      {
        employeeId: 'EMP002',
        date: new Date('2025-01-24'),
        clockIn: new Date('2025-01-24T08:45:00'),
        clockOut: new Date('2025-01-24T17:15:00'),
        hoursWorked: 8.5,
        status: 'present' as const,
        location: 'remote'
      },
      {
        employeeId: 'EMP003',
        date: new Date('2025-01-24'),
        clockIn: new Date('2025-01-24T09:15:00'),
        clockOut: new Date('2025-01-24T18:00:00'),
        hoursWorked: 8.75,
        status: 'late' as const,
        location: 'office'
      },
      {
        employeeId: 'EMP004',
        date: new Date('2025-01-24'),
        clockIn: new Date('2025-01-24T08:30:00'),
        clockOut: new Date('2025-01-24T17:45:00'),
        hoursWorked: 9.25,
        status: 'present' as const,
        location: 'office'
      },
      {
        employeeId: 'EMP005',
        date: new Date('2025-01-24'),
        status: 'absent' as const,
        location: 'office'
      }
    ];

    // Create attendance records (only if we have created employees)
    if (createdEmployees.length > 0) {
      for (let i = 0; i < Math.min(attendanceRecords.length, createdEmployees.length); i++) {
        const attendance = {
          ...attendanceRecords[i],
          employeeId: createdEmployees[i].id // Use actual employee UUID
        };
        try {
          const created = await storage.createAttendance(attendance);
          console.log(`✅ Created attendance record for ${createdEmployees[i].firstName}`);
        } catch (error) {
          console.log(`⚠️  Attendance record for ${createdEmployees[i].firstName} might already exist`);
        }
      }
    }

    // Create sample leave requests
    const leaveRequests = [
      {
        employeeId: 'EMP001',
        type: 'annual' as const,
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-02-19'),
        daysRequested: '5',
        reason: 'Family vacation',
        status: 'approved' as const,
        approvedBy: 'EMP004',
        approvedAt: new Date('2025-01-20'),
        submittedBy: 'EMP001',
        appliedAt: new Date('2025-01-18')
      },
      {
        employeeId: 'EMP002',
        type: 'sick' as const,
        startDate: new Date('2025-01-22'),
        endDate: new Date('2025-01-22'),
        daysRequested: '1',
        reason: 'Medical appointment',
        status: 'approved' as const,
        approvedBy: 'EMP003',
        approvedAt: new Date('2025-01-21'),
        submittedBy: 'EMP002',
        appliedAt: new Date('2025-01-21')
      },
      {
        employeeId: 'EMP005',
        type: 'personal' as const,
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-12'),
        daysRequested: '3',
        reason: 'Personal matters',
        status: 'pending' as const,
        submittedBy: 'EMP005',
        appliedAt: new Date('2025-01-25')
      }
    ];

    // Create leave requests (only if we have created employees)
    if (createdEmployees.length > 0) {
      for (let i = 0; i < Math.min(leaveRequests.length, createdEmployees.length); i++) {
        const request = {
          ...leaveRequests[i],
          employeeId: createdEmployees[i].id, // Use actual employee UUID
          submittedBy: createdEmployees[i].id, // Same employee as submitter
          reviewedBy: i > 0 ? createdEmployees[0].id : undefined, // Manager reviews
          approvedBy: i > 0 ? createdEmployees[0].id : undefined
        };
        try {
          const created = await storage.createLeaveRequest(request);
          console.log(`✅ Created leave request for ${createdEmployees[i].firstName}`);
        } catch (error) {
          console.log(`⚠️  Leave request for ${createdEmployees[i].firstName} might already exist`);
        }
      }
    }

    // Create sample training programs
    const trainingPrograms = [
      {
        name: 'Leadership Development Program',
        description: 'Comprehensive leadership training for managers and senior staff',
        duration: 40,
        instructor: 'External Consultant',
        maxParticipants: 20,
        status: 'active',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-04-30'),
        cost: 2500.00,
        category: 'leadership'
      },
      {
        name: 'Technical Skills Bootcamp',
        description: 'Advanced technical training for engineering team',
        duration: 80,
        instructor: 'David Rodriguez',
        maxParticipants: 15,
        status: 'active',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-05-15'),
        cost: 1500.00,
        category: 'technical'
      },
      {
        name: 'Customer Service Excellence',
        description: 'Customer service training for all customer-facing roles',
        duration: 16,
        instructor: 'Jennifer Williams',
        maxParticipants: 25,
        status: 'planned',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-15'),
        cost: 800.00,
        category: 'customer_service'
      }
    ];

    // Create training programs
    const createdPrograms = [];
    for (const program of trainingPrograms) {
      try {
        const created = await storage.createTrainingProgram(program);
        createdPrograms.push(created);
        console.log(`✅ Created training program: ${created.name}`);
      } catch (error) {
        console.log(`⚠️  Training program ${program.name} might already exist`);
      }
    }

    // Create sample performance reviews
    const performanceReviews = [
      {
        employeeId: 'EMP001',
        reviewerId: 'EMP004',
        reviewPeriodStart: new Date('2024-07-01'),
        reviewPeriodEnd: new Date('2024-12-31'),
        overallScore: 4.2,
        goals: 'Lead frontend architecture improvements',
        achievements: 'Successfully delivered 3 major features ahead of schedule',
        areasForImprovement: 'Could improve cross-team collaboration',
        reviewerComments: 'Excellent technical skills and delivery. Strong performer.',
        employeeComments: 'Looking forward to taking on more leadership responsibilities',
        status: 'completed',
        reviewDate: new Date('2025-01-15')
      },
      {
        employeeId: 'EMP002',
        reviewerId: 'EMP003',
        reviewPeriodStart: new Date('2024-07-01'),
        reviewPeriodEnd: new Date('2024-12-31'),
        overallScore: 3.8,
        goals: 'Increase lead generation by 25%',
        achievements: 'Exceeded lead generation target by 30%. Launched successful campaigns.',
        areasForImprovement: 'Could strengthen analytics and reporting skills',
        reviewerComments: 'Great results and creativity in campaign development',
        employeeComments: 'Excited to expand into digital marketing channels',
        status: 'completed',
        reviewDate: new Date('2025-01-12')
      }
    ];

    // Create performance reviews (only if we have created employees)
    if (createdEmployees.length >= 2) {
      for (let i = 0; i < Math.min(performanceReviews.length, createdEmployees.length - 1); i++) {
        const review = {
          ...performanceReviews[i],
          employeeId: createdEmployees[i].id, // Use actual employee UUID
          reviewerId: createdEmployees[i + 1].id // Next employee as reviewer
        };
        try {
          const created = await storage.createPerformanceReview(review);
          console.log(`✅ Created performance review for ${createdEmployees[i].firstName}`);
        } catch (error) {
          console.log(`⚠️  Performance review for ${createdEmployees[i].firstName} might already exist`);
        }
      }
    }

    console.log("🎉 HRMS data seeding completed successfully!");
    
    return {
      employees: createdEmployees.length,
      attendance: attendanceRecords.length,
      leaveRequests: leaveRequests.length,
      trainingPrograms: createdPrograms.length,
      performanceReviews: performanceReviews.length
    };

  } catch (error) {
    console.error("❌ Error seeding HRMS data:", error);
    throw error;
  }
}