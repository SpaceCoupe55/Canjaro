// Mock data for the recycling token system
export const mockData = {
  users: [
    {
      id: 'user123',
      name: 'John Doe',
      email: 'user@demo.com',
      role: 'user',
      nationalId: 'GH123456789',
      phone: '+233244123456',
      tokenBalance: 150,
      verified: true,
      verificationDate: '2024-01-10',
      joinDate: '2024-01-15',
      profileImage: null,
      address: {
        street: '123 Main St',
        city: 'Accra',
        region: 'Greater Accra',
        country: 'Ghana'
      },
      statistics: {
        totalDeposits: 45,
        totalWeight: 112.5,
        totalTokensEarned: 1125,
        totalRedeemed: 975,
        environmentalImpact: {
          co2Saved: 337.5,
          waterSaved: 2250
        }
      }
    },
    {
      id: 'col456',
      name: 'Jane Smith',
      email: 'collector@demo.com',
      role: 'collector',
      nationalId: 'GH987654321',
      phone: '+233244987654',
      tokenBalance: 0,
      verified: true,
      verificationDate: '2024-01-05',
      joinDate: '2024-01-01',
      profileImage: null,
      address: {
        street: '456 Collector Ave',
        city: 'Accra',
        region: 'Greater Accra',
        country: 'Ghana'
      },
      statistics: {
        totalCollections: 120,
        totalWeight: 450.5,
        totalEarnings: 4505,
        averageRating: 4.8,
        reliabilityScore: 95
      }
    },
    {
      id: 'cp001',
      name: 'Central Recycling Hub',
      email: 'point@demo.com',
      role: 'collection_point',
      nationalId: 'GH555666777',
      phone: '+233244555666',
      tokenBalance: 0,
      verified: true,
      verificationDate: '2024-01-01',
      joinDate: '2024-01-01',
      profileImage: null,
      address: {
        street: '789 Recycling St',
        city: 'Tema',
        region: 'Greater Accra',
        country: 'Ghana'
      },
      statistics: {
        totalBatchesProcessed: 250,
        totalWeightProcessed: 1250.5,
        totalTokensDistributed: 12505,
        averageProcessingTime: 15
      }
    }
  ],

  deposits: [
    {
      id: 'dep123',
      userId: 'user123',
      userName: 'John Doe',
      collectorId: 'col456',
      collectorName: 'Jane Smith',
      weight: 2.5,
      plasticType: 'PET',
      tokensEarned: 25,
      tokenRate: 10,
      status: 'confirmed',
      qrCode: 'QR123456789',
      location: {
        lat: 5.6037,
        lng: -0.1870,
        address: 'Accra, Ghana'
      },
      photos: ['url1', 'url2'],
      notes: 'Clean PET bottles',
      timestamp: '2024-01-20T10:30:00Z',
      confirmedAt: '2024-01-20T14:30:00Z',
      batchId: 'batch789'
    },
    {
      id: 'dep124',
      userId: 'user123',
      userName: 'John Doe',
      collectorId: 'col456',
      collectorName: 'Jane Smith',
      weight: 1.8,
      plasticType: 'HDPE',
      tokensEarned: 18,
      tokenRate: 10,
      status: 'pending',
      qrCode: 'QR123456790',
      location: {
        lat: 5.6037,
        lng: -0.1870,
        address: 'Accra, Ghana'
      },
      photos: ['url3'],
      notes: 'HDPE containers',
      timestamp: '2024-01-21T09:15:00Z',
      confirmedAt: null,
      batchId: null
    },
    {
      id: 'dep125',
      userId: 'user123',
      userName: 'John Doe',
      collectorId: 'col456',
      collectorName: 'Jane Smith',
      weight: 3.2,
      plasticType: 'Mixed',
      tokensEarned: 32,
      tokenRate: 10,
      status: 'confirmed',
      qrCode: 'QR123456791',
      location: {
        lat: 5.6037,
        lng: -0.1870,
        address: 'Accra, Ghana'
      },
      photos: ['url4', 'url5'],
      notes: 'Mixed plastic waste',
      timestamp: '2024-01-19T16:45:00Z',
      confirmedAt: '2024-01-19T20:15:00Z',
      batchId: 'batch788'
    }
  ],

  batches: [
    {
      id: 'batch789',
      collectorId: 'col456',
      collectorName: 'Jane Smith',
      deposits: ['dep123', 'dep124', 'dep125'],
      totalDeposits: 3,
      expectedWeight: 7.5,
      actualWeight: 7.2,
      weightDiscrepancy: -0.3,
      status: 'verified',
      createdAt: '2024-01-20T10:00:00Z',
      deliveredAt: '2024-01-20T15:00:00Z',
      verifiedAt: '2024-01-20T15:30:00Z',
      settledAt: '2024-01-20T16:00:00Z',
      collectionPointId: 'cp001',
      collectionPointName: 'Central Recycling Hub',
      earnings: {
        expected: 75,
        actual: 72,
        paid: true
      },
      route: {
        distance: 5.2,
        duration: 45,
        optimizationScore: 8.5
      }
    },
    {
      id: 'batch790',
      collectorId: 'col456',
      collectorName: 'Jane Smith',
      deposits: ['dep126', 'dep127'],
      totalDeposits: 2,
      expectedWeight: 4.5,
      actualWeight: 0,
      weightDiscrepancy: 0,
      status: 'pending',
      createdAt: '2024-01-21T08:00:00Z',
      deliveredAt: null,
      verifiedAt: null,
      settledAt: null,
      collectionPointId: null,
      collectionPointName: null,
      earnings: {
        expected: 45,
        actual: 0,
        paid: false
      },
      route: {
        distance: 3.8,
        duration: 30,
        optimizationScore: 9.2
      }
    }
  ],

  redemptions: [
    {
      id: 'red123',
      userId: 'user123',
      type: 'store_discount',
      tokensSpent: 50,
      cashValue: 5.00,
      partner: {
        id: 'partner001',
        name: 'GreenMart Supermarket',
        logo: 'url',
        category: 'Retail'
      },
      voucherCode: 'VOUCHER123456',
      status: 'active',
      expiresAt: '2024-02-20T00:00:00Z',
      redeemedAt: '2024-01-20T12:00:00Z',
      usedAt: null
    },
    {
      id: 'red124',
      userId: 'user123',
      type: 'cash_withdrawal',
      tokensSpent: 100,
      cashValue: 10.00,
      partner: {
        id: 'partner002',
        name: 'Mobile Money',
        logo: 'url',
        category: 'Financial'
      },
      voucherCode: 'VOUCHER789012',
      status: 'used',
      expiresAt: '2024-02-15T00:00:00Z',
      redeemedAt: '2024-01-15T10:30:00Z',
      usedAt: '2024-01-16T14:20:00Z'
    }
  ],

  notifications: [
    {
      id: 'notif123',
      userId: 'user123',
      type: 'deposit_confirmed',
      title: 'Deposit Confirmed',
      message: 'Your deposit of 2.5kg PET has been confirmed. You earned 25 tokens!',
      timestamp: '2024-01-20T14:30:00Z',
      read: false
    },
    {
      id: 'notif124',
      userId: 'user123',
      type: 'tokens_redeemed',
      title: 'Tokens Redeemed',
      message: 'You successfully redeemed 50 tokens for a GreenMart voucher.',
      timestamp: '2024-01-20T12:00:00Z',
      read: true
    },
    {
      id: 'notif125',
      userId: 'col456',
      type: 'batch_verified',
      title: 'Batch Verified',
      message: 'Your batch #789 has been verified. Payment of ₵72 is being processed.',
      timestamp: '2024-01-20T15:30:00Z',
      read: false
    }
  ],

  partners: [
    {
      id: 'partner001',
      name: 'GreenMart Supermarket',
      logo: 'url',
      category: 'Retail',
      description: 'Leading supermarket chain with eco-friendly products',
      locations: ['Accra', 'Tema', 'Kumasi'],
      redemptionRate: 10, // 10 tokens = 1% discount
      minTokens: 50,
      maxTokens: 500
    },
    {
      id: 'partner002',
      name: 'EcoStore',
      logo: 'url',
      category: 'Retail',
      description: 'Specialty store for sustainable products',
      locations: ['Accra', 'Labone'],
      redemptionRate: 1, // 1 token = 1 GHS
      minTokens: 10,
      maxTokens: 200
    },
    {
      id: 'partner003',
      name: 'PlantTrees Charity',
      logo: 'url',
      category: 'Charity',
      description: 'Environmental conservation organization',
      locations: ['Nationwide'],
      redemptionRate: 5, // 5 tokens = 1 tree planted
      minTokens: 25,
      maxTokens: 1000
    }
  ],

  collectionPoints: [
    {
      id: 'cp001',
      name: 'Central Recycling Hub',
      address: '789 Recycling St, Tema',
      coordinates: { lat: 5.6037, lng: -0.1870 },
      operatingHours: '6:00 AM - 8:00 PM',
      contact: '+233244555666',
      capacity: 1000,
      currentWeight: 750.5
    },
    {
      id: 'cp002',
      name: 'GreenWaste Collection Center',
      address: '456 Green St, Dzorwulu',
      coordinates: { lat: 5.6037, lng: -0.1870 },
      operatingHours: '7:00 AM - 7:00 PM',
      contact: '+233244555777',
      capacity: 800,
      currentWeight: 450.2
    }
  ],

  analytics: {
    daily: {
      totalWeight: 125.5,
      totalBatches: 8,
      totalDeposits: 32,
      totalCollectors: 5,
      totalUsers: 45,
      tokensDistributed: 1255,
      plasticByType: {
        PET: 60.2,
        HDPE: 25.1,
        LDPE: 20.3,
        PP: 15.8,
        Mixed: 4.1
      }
    },
    weekly: {
      totalWeight: 875.5,
      totalBatches: 56,
      totalDeposits: 224,
      totalCollectors: 12,
      totalUsers: 85,
      tokensDistributed: 8755,
      plasticByType: {
        PET: 420.5,
        HDPE: 175.2,
        LDPE: 140.8,
        PP: 110.5,
        Mixed: 28.5
      }
    },
    monthly: {
      totalWeight: 3500.5,
      totalBatches: 224,
      totalDeposits: 896,
      totalCollectors: 15,
      totalUsers: 120,
      tokensDistributed: 35005,
      plasticByType: {
        PET: 1682.5,
        HDPE: 700.8,
        LDPE: 563.2,
        PP: 442.0,
        Mixed: 114.0
      }
    }
  }
}
