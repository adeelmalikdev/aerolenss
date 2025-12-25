export interface HotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  rooms: number;
  currency?: string;
}

export interface HotelOffer {
  type: string;
  hotel: {
    hotelId: string;
    name: string;
    cityCode: string;
    chainCode?: string;
    latitude?: number;
    longitude?: number;
    address?: {
      lines?: string[];
      postalCode?: string;
      cityName?: string;
      countryCode?: string;
    };
    amenities?: string[];
    rating?: string;
    media?: {
      uri: string;
      category: string;
    }[];
    description?: {
      text: string;
      lang: string;
    };
  };
  available: boolean;
  offers: RoomOffer[];
}

export interface RoomOffer {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  rateCode: string;
  rateFamilyEstimated?: {
    code: string;
    type: string;
  };
  room: {
    type: string;
    typeEstimated?: {
      category: string;
      beds?: number;
      bedType?: string;
    };
    description?: {
      text: string;
      lang: string;
    };
  };
  guests?: {
    adults: number;
    childAges?: number[];
  };
  price: {
    currency: string;
    base?: string;
    total: string;
    variations?: {
      average?: {
        base: string;
        total: string;
      };
      changes?: {
        startDate: string;
        endDate: string;
        base: string;
        total: string;
      }[];
    };
  };
  policies?: {
    cancellations?: {
      deadline?: string;
      amount?: string;
      type?: string;
      description?: {
        text: string;
      };
    }[];
    paymentType?: string;
    checkInOut?: {
      checkIn?: string;
      checkOut?: string;
    };
  };
  boardType?: string;
}

export interface HotelBookingRequest {
  offerId: string;
  guests: {
    name: {
      title: string;
      firstName: string;
      lastName: string;
    };
    contact: {
      phone: string;
      email: string;
    };
  }[];
  payments: {
    method: string;
    card?: {
      vendorCode: string;
      cardNumber: string;
      expiryDate: string;
    };
  }[];
}

export interface CitySearchResult {
  iataCode: string;
  name: string;
  countryName?: string;
  address?: {
    cityName: string;
    countryName: string;
  };
}
