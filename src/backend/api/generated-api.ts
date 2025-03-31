type UserSession = any;

import { getUserRole } from "@/utils/auth";

// Table: users
/**
 * Select permission for users (therapist)
 * Columns: id, name, role, profile_picture, created_at, updated_at, verified_at, phone_number
 * Filter: {}
 */
export const canSelectUsersTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for users (tourist)
 * Columns: id, name, role, profile_picture, created_at, verified_at, phone_number
 * Filter: {}
 */
export const canSelectUsersTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for users (therapist)
 * Columns: name, email, password_hash, role, profile_picture, phone_number
 * Check: {
  &quot;role&quot;: {
    &quot;_eq&quot;: &quot;therapist&quot;
  }
}
 */
export const canInsertUsersTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Insert permission for users (tourist)
 * Columns: name, email, password_hash, role, profile_picture, phone_number
 * Check: {
  &quot;role&quot;: {
    &quot;_eq&quot;: &quot;tourist&quot;
  }
}
 */
export const canInsertUsersTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for users (therapist)
 * Columns: name, profile_picture, phone_number
 * Filter: {
  &quot;id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateUsersTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Update permission for users (tourist)
 * Columns: name, profile_picture, phone_number
 * Filter: {
  &quot;id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateUsersTourist = (userSession: UserSession): boolean => {
  return true;
};


// Table: posts
/**
 * Select permission for posts (therapist)
 * Columns: id, user_id, content, post_type, location, created_at, updated_at
 * Filter: {}
 */
export const canSelectPostsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for posts (tourist)
 * Columns: id, user_id, content, post_type, location, created_at, updated_at
 * Filter: {}
 */
export const canSelectPostsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for posts (therapist)
 * Columns: user_id, content, media_id, post_type, location
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertPostsTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Insert permission for posts (tourist)
 * Columns: user_id, content, media_id, post_type, location
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertPostsTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for posts (therapist)
 * Columns: content, media_id, post_type, location
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdatePostsTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Update permission for posts (tourist)
 * Columns: content, media_id, post_type, location
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdatePostsTourist = (userSession: UserSession): boolean => {
  return true;
};


// Table: media
/**
 * Select permission for media (therapist)
 * Columns: *
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectMediaTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for media (tourist)
 * Columns: id, therapist_id, media_type, url, caption, created_at, is_profile_image, is_service_image, is_review_image
 * Filter: {
  &quot;access_level&quot;: {
    &quot;_eq&quot;: &quot;public&quot;
  }
}
 */
export const canSelectMediaTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for media (therapist)
 * Columns: therapist_id, media_type, url, caption, is_profile_image, is_service_image, is_review_image, access_level
 * Check: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertMediaTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for media (therapist)
 * Columns: caption, access_level
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateMediaTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Delete permission for media (therapist)
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canDeleteMediaTherapist = (userSession: UserSession): boolean => {
  return true;
};

// Table: therapist_profiles
/**
 * Select permission for therapist_profiles (therapist)
 * Columns: id, user_id, bio, experience_years, location, languages, certifications, working_hours, status, last_online_at, price_range_min, price_range_max, currency, business_name, address
 * Filter: {}
 */
export const canSelectTherapistProfilesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for therapist_profiles (tourist)
 * Columns: id, user_id, bio, experience_years, location, languages, certifications, working_hours, status, last_online_at, price_range_min, price_range_max, currency, business_name, address
 * Filter: {}
 */
export const canSelectTherapistProfilesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for therapist_profiles (therapist)
 * Columns: user_id, bio, experience_years, location, languages, certifications, working_hours, price_range_min, price_range_max, currency, business_name, address, status
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertTherapistProfilesTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for therapist_profiles (therapist)
 * Columns: bio, experience_years, location, languages, certifications, working_hours, price_range_min, price_range_max, currency, business_name, address, status
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateTherapistProfilesTherapist = (userSession: UserSession): boolean => {
  return true;
};


// Table: tourist_profiles
/**
 * Select permission for tourist_profiles (tourist)
 * Columns: id, user_id, nationality, languages, interests, travel_dates, budget, preferences
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectTouristProfilesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for tourist_profiles (therapist)
 * Columns: id, user_id, nationality, languages, interests, travel_dates, budget, preferences
 * Filter: {}
 */
export const canSelectTouristProfilesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for tourist_profiles (tourist)
 * Columns: user_id, nationality, languages, interests, travel_dates, budget, preferences
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertTouristProfilesTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for tourist_profiles (tourist)
 * Columns: nationality, languages, interests, travel_dates, budget, preferences
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateTouristProfilesTourist = (userSession: UserSession): boolean => {
  return true;
};


// Table: therapist_availability
/**
 * Select permission for therapist_availability (therapist)
 * Columns: *
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectTherapistAvailabilityTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for therapist_availability (tourist)
 * Columns: id, therapist_id, start_time, end_time, is_available, recurrence_rule
 * Filter: {
  &quot;is_available&quot;: {
    &quot;_eq&quot;: true
  }
}
 */
export const canSelectTherapistAvailabilityTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for therapist_availability (therapist)
 * Columns: therapist_id, start_time, end_time, is_available, recurrence_rule
 * Check: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertTherapistAvailabilityTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for therapist_availability (therapist)
 * Columns: start_time, end_time, is_available, recurrence_rule
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateTherapistAvailabilityTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Delete permission for therapist_availability (therapist)
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canDeleteTherapistAvailabilityTherapist = (userSession: UserSession): boolean => {
  return true;
};

// Table: therapist_services
/**
 * Select permission for therapist_services (therapist)
 * Columns: *
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectTherapistServicesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for therapist_services (tourist)
 * Columns: id, therapist_id, service_name, description, duration, price, currency, category, is_active, created_at, updated_at
 * Filter: {
  &quot;is_active&quot;: {
    &quot;_eq&quot;: true
  }
}
 */
export const canSelectTherapistServicesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for therapist_services (therapist)
 * Columns: therapist_id, service_name, description, duration, price, currency, category, is_active
 * Check: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertTherapistServicesTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for therapist_services (therapist)
 * Columns: service_name, description, duration, price, currency, category, is_active
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateTherapistServicesTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Delete permission for therapist_services (therapist)
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canDeleteTherapistServicesTherapist = (userSession: UserSession): boolean => {
  return true;
};

// Table: bookings
/**
 * Select permission for bookings (therapist)
 * Columns: *
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectBookingsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for bookings (tourist)
 * Columns: *
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectBookingsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for bookings (tourist)
 * Columns: guest_id, therapist_id, service_id, start_time, end_time, booking_notes
 * Check: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertBookingsTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for bookings (therapist)
 * Columns: status, confirmed_at, completed_at
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateBookingsTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Update permission for bookings (tourist)
 * Columns: status, canceled_at
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateBookingsTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Delete permission for bookings (tourist)
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canDeleteBookingsTourist = (userSession: UserSession): boolean => {
  return true;
};

// Table: likes
/**
 * Select permission for likes (therapist)
 * Columns: id, guest_id, therapist_id, created_at, updated_at
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectLikesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for likes (tourist)
 * Columns: id, guest_id, therapist_id, created_at, updated_at
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectLikesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for likes (tourist)
 * Columns: guest_id, therapist_id
 * Check: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertLikesTourist = (userSession: UserSession): boolean => {
  return true;
};


/**
 * Delete permission for likes (tourist)
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canDeleteLikesTourist = (userSession: UserSession): boolean => {
  return true;
};

// Table: matches
/**
 * Select permission for matches (therapist)
 * Columns: id, guest_id, therapist_id, matched_at, created_at, updated_at
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectMatchesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for matches (tourist)
 * Columns: id, guest_id, therapist_id, matched_at, created_at, updated_at
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectMatchesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for matches (therapist)
 * Columns: guest_id, therapist_id, matched_at
 * Check: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertMatchesTherapist = (userSession: UserSession): boolean => {
  return true;
};



// Table: reviews
/**
 * Select permission for reviews (therapist)
 * Columns: *
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectReviewsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for reviews (tourist)
 * Columns: *
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectReviewsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for reviews (tourist)
 * Columns: booking_id, guest_id, therapist_id, rating, comment, review_type, media_urls
 * Check: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertReviewsTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for reviews (tourist)
 * Columns: rating, comment, media_urls
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateReviewsTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Delete permission for reviews (tourist)
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canDeleteReviewsTourist = (userSession: UserSession): boolean => {
  return true;
};

// Table: transactions
/**
 * Select permission for transactions (therapist)
 * Columns: *
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectTransactionsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for transactions (tourist)
 * Columns: *
 * Filter: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectTransactionsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for transactions (tourist)
 * Columns: booking_id, guest_id, therapist_id, amount, currency, payment_status, payment_method, gateway_transaction_id, transaction_date
 * Check: {
  &quot;guest_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertTransactionsTourist = (userSession: UserSession): boolean => {
  return true;
};



// Table: user_preferences
/**
 * Select permission for user_preferences (tourist)
 * Columns: *
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectUserPreferencesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for user_preferences (tourist)
 * Columns: user_id, preferred_services, preferred_duration, preferred_budget, preferred_languages, gender_preference, amenities_preference
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertUserPreferencesTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for user_preferences (tourist)
 * Columns: preferred_services, preferred_duration, preferred_budget, preferred_languages, gender_preference, amenities_preference
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateUserPreferencesTourist = (userSession: UserSession): boolean => {
  return true;
};


// Table: notifications
/**
 * Select permission for notifications (therapist)
 * Columns: *
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectNotificationsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for notifications (tourist)
 * Columns: *
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectNotificationsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for notifications (therapist)
 * Columns: user_id, type, message, details, is_read
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertNotificationsTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Insert permission for notifications (tourist)
 * Columns: user_id, type, message, details, is_read
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertNotificationsTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for notifications (therapist)
 * Columns: is_read
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateNotificationsTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Update permission for notifications (tourist)
 * Columns: is_read
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateNotificationsTourist = (userSession: UserSession): boolean => {
  return true;
};


// Table: events
/**
 * Select permission for events (therapist)
 * Columns: *
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectEventsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for events (tourist)
 * Columns: id, therapist_id, title, description, start_date, end_date, discount_percentage, is_active, created_at, updated_at
 * Filter: {
  &quot;is_active&quot;: {
    &quot;_eq&quot;: true
  }
}
 */
export const canSelectEventsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for events (therapist)
 * Columns: therapist_id, title, description, start_date, end_date, discount_percentage, is_active
 * Check: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertEventsTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for events (therapist)
 * Columns: title, description, start_date, end_date, discount_percentage, is_active
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateEventsTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Delete permission for events (therapist)
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canDeleteEventsTherapist = (userSession: UserSession): boolean => {
  return true;
};

// Table: local_experiences
/**
 * Select permission for local_experiences (therapist)
 * Columns: *
 * Filter: {}
 */
export const canSelectLocalExperiencesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for local_experiences (tourist)
 * Columns: *
 * Filter: {}
 */
export const canSelectLocalExperiencesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};




// Table: activity_logs
/**
 * Select permission for activity_logs (therapist)
 * Columns: *
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectActivityLogsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for activity_logs (tourist)
 * Columns: *
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectActivityLogsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for activity_logs (therapist)
 * Columns: user_id, activity_type, description, request_details
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertActivityLogsTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Insert permission for activity_logs (tourist)
 * Columns: user_id, activity_type, description, request_details
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertActivityLogsTourist = (userSession: UserSession): boolean => {
  return true;
};



// Table: error_logs
/**
 * Select permission for error_logs (therapist)
 * Columns: *
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectErrorLogsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for error_logs (tourist)
 * Columns: *
 * Filter: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectErrorLogsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for error_logs (therapist)
 * Columns: user_id, error_type, message, stack_trace, request_details
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertErrorLogsTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Insert permission for error_logs (tourist)
 * Columns: user_id, error_type, message, stack_trace, request_details
 * Check: {
  &quot;user_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertErrorLogsTourist = (userSession: UserSession): boolean => {
  return true;
};



// Table: service_categories
/**
 * Select permission for service_categories (therapist)
 * Columns: *
 * Filter: {}
 */
export const canSelectServiceCategoriesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for service_categories (tourist)
 * Columns: *
 * Filter: {}
 */
export const canSelectServiceCategoriesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};




// Table: local_experience_categories
/**
 * Select permission for local_experience_categories (therapist)
 * Columns: *
 * Filter: {}
 */
export const canSelectLocalExperienceCategoriesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for local_experience_categories (tourist)
 * Columns: *
 * Filter: {}
 */
export const canSelectLocalExperienceCategoriesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};




// Table: regions
/**
 * Select permission for regions (therapist)
 * Columns: *
 * Filter: {}
 */
export const canSelectRegionsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for regions (tourist)
 * Columns: *
 * Filter: {}
 */
export const canSelectRegionsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};




// Table: unavailable_dates
/**
 * Select permission for unavailable_dates (therapist)
 * Columns: *
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canSelectUnavailableDatesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for unavailable_dates (tourist)
 * Columns: id, therapist_id, start_date, end_date
 * Filter: {}
 */
export const canSelectUnavailableDatesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for unavailable_dates (therapist)
 * Columns: therapist_id, start_date, end_date
 * Check: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertUnavailableDatesTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for unavailable_dates (therapist)
 * Columns: start_date, end_date
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateUnavailableDatesTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Delete permission for unavailable_dates (therapist)
 * Filter: {
  &quot;therapist_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canDeleteUnavailableDatesTherapist = (userSession: UserSession): boolean => {
  return true;
};

// Table: service_media
/**
 * Select permission for service_media (therapist)
 * Columns: *
 * Filter: {
  &quot;service_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;therapist_services&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canSelectServiceMediaTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for service_media (tourist)
 * Columns: id, service_id, media_id, order_index
 * Filter: {}
 */
export const canSelectServiceMediaTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for service_media (therapist)
 * Columns: service_id, media_id, order_index
 * Check: {
  &quot;service_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;therapist_services&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canInsertServiceMediaTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for service_media (therapist)
 * Columns: order_index
 * Filter: {
  &quot;service_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;therapist_services&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canUpdateServiceMediaTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Delete permission for service_media (therapist)
 * Filter: {
  &quot;service_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;therapist_services&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canDeleteServiceMediaTherapist = (userSession: UserSession): boolean => {
  return true;
};

// Table: event_media
/**
 * Select permission for event_media (therapist)
 * Columns: *
 * Filter: {
  &quot;event_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;events&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canSelectEventMediaTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for event_media (tourist)
 * Columns: id, event_id, media_id, order_index
 * Filter: {}
 */
export const canSelectEventMediaTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for event_media (therapist)
 * Columns: event_id, media_id, order_index
 * Check: {
  &quot;event_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;events&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canInsertEventMediaTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for event_media (therapist)
 * Columns: order_index
 * Filter: {
  &quot;event_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;events&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canUpdateEventMediaTherapist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Delete permission for event_media (therapist)
 * Filter: {
  &quot;event_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;events&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canDeleteEventMediaTherapist = (userSession: UserSession): boolean => {
  return true;
};

// Table: local_experience_media
/**
 * Select permission for local_experience_media (therapist)
 * Columns: *
 * Filter: {}
 */
export const canSelectLocalExperienceMediaTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for local_experience_media (tourist)
 * Columns: *
 * Filter: {}
 */
export const canSelectLocalExperienceMediaTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};




// Table: realtime_messages
/**
 * Select permission for realtime_messages (therapist)
 * Columns: id, sender_id, receiver_id, content, translated_content, is_read, sent_at, read_at, created_at, updated_at
 * Filter: {
  &quot;_or&quot;: [
    {
      &quot;sender_id&quot;: {
        &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
      }
    },
    {
      &quot;receiver_id&quot;: {
        &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
      }
    }
  ]
}
 */
export const canSelectRealtimeMessagesTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for realtime_messages (tourist)
 * Columns: id, sender_id, receiver_id, content, translated_content, is_read, sent_at, read_at, created_at, updated_at
 * Filter: {
  &quot;_or&quot;: [
    {
      &quot;sender_id&quot;: {
        &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
      }
    },
    {
      &quot;receiver_id&quot;: {
        &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
      }
    }
  ]
}
 */
export const canSelectRealtimeMessagesTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for realtime_messages (therapist)
 * Columns: sender_id, receiver_id, content, translated_content
 * Check: {
  &quot;sender_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertRealtimeMessagesTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Insert permission for realtime_messages (tourist)
 * Columns: sender_id, receiver_id, content, translated_content
 * Check: {
  &quot;sender_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canInsertRealtimeMessagesTourist = (userSession: UserSession): boolean => {
  return true;
};

/**
 * Update permission for realtime_messages (therapist)
 * Columns: is_read, read_at
 * Filter: {
  &quot;receiver_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateRealtimeMessagesTherapist = (userSession: UserSession): boolean => {
  return true;
};
/**
 * Update permission for realtime_messages (tourist)
 * Columns: is_read, read_at
 * Filter: {
  &quot;receiver_id&quot;: {
    &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
  }
}
 */
export const canUpdateRealtimeMessagesTourist = (userSession: UserSession): boolean => {
  return true;
};


// Table: storage_objects
/**
 * Select permission for storage_objects (therapist)
 * Columns: *
 * Filter: {
  &quot;media_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;media&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canSelectStorageObjectsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for storage_objects (tourist)
 * Columns: id, bucket_id, object_path, media_id, mime_type, size, created_at, updated_at
 * Filter: {
  &quot;media_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;media&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;access_level&quot;: {
            &quot;_eq&quot;: &quot;public&quot;
          }
        }
      }
    }
  }
}
 */
export const canSelectStorageObjectsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};

/**
 * Insert permission for storage_objects (therapist)
 * Columns: bucket_id, object_path, media_id, mime_type, size
 * Check: {
  &quot;media_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;media&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canInsertStorageObjectsTherapist = (userSession: UserSession): boolean => {
  return true;
};


/**
 * Delete permission for storage_objects (therapist)
 * Filter: {
  &quot;media_id&quot;: {
    &quot;_in&quot;: {
      &quot;_select&quot;: {
        &quot;columns&quot;: [
          &quot;id&quot;
        ],
        &quot;table&quot;: {
          &quot;name&quot;: &quot;media&quot;,
          &quot;schema&quot;: &quot;public&quot;
        },
        &quot;where&quot;: {
          &quot;therapist_id&quot;: {
            &quot;_eq&quot;: &quot;X-Hasura-User-Id&quot;
          }
        }
      }
    }
  }
}
 */
export const canDeleteStorageObjectsTherapist = (userSession: UserSession): boolean => {
  return true;
};

// Table: storage_buckets
/**
 * Select permission for storage_buckets (therapist)
 * Columns: *
 * Filter: {}
 */
export const canSelectStorageBucketsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for storage_buckets (tourist)
 * Columns: *
 * Filter: {}
 */
export const canSelectStorageBucketsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};




// Table: application_settings
/**
 * Select permission for application_settings (therapist)
 * Columns: *
 * Filter: {}
 */
export const canSelectApplicationSettingsTherapist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};
/**
 * Select permission for application_settings (tourist)
 * Columns: *
 * Filter: {}
 */
export const canSelectApplicationSettingsTourist = (userSession: UserSession): boolean => {
  // TODO: Implement logic
  return true;
};




