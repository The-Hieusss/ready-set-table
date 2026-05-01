import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type UserRole = "customer" | "owner";

export type User = {
  id?: string;
  user_id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type AppUserProfile = {
  id: string;
  user_id: string;
  full_name: string;
  role: UserRole;
  email?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  address: string;
  city: string;
  cuisine: string;
  cuisine_type?: string;
  description: string;
  imageUrl: string;
  image_url?: string;
  rating: number | null;
  phone?: string | null;
  opening_hours?: string | null;
  owner_id?: string;
};

export type Reservation = {
  id: string;
  reservation_id?: string;
  restaurantId: string;
  restaurant_id?: string;
  restaurantName: string;
  restaurant_name?: string;
  date: string;
  reservation_date?: string | null;
  time: string;
  reservation_time?: string;
  partySize: number;
  party_size?: number;
  status: "upcoming" | "completed" | "cancelled";
};

export type Review = {
  id: string;
  review_id?: string;
  restaurantId: string;
  restaurant_id?: string;
  reviewerName: string;
  reviewer_name?: string;
  rating: number;
  comment: string;
  createdAt: string;
  review_date?: string;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL ,SUPABASE_KEY 
);

function ensureConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase environment variables.");
  }
}

function authHeaders(token?: string) {
  ensureConfig();

  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token ?? SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function restRequest<T>(path: string, init?: RequestInit): Promise<T> {
  ensureConfig();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  return parseResponse<T>(response);
}

async function authedRestRequest<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  ensureConfig();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...authHeaders(token),
      ...(init?.headers ?? {}),
    },
  });

  return parseResponse<T>(response);
}

export async function signInWithPassword(email: string, password: string) {
  ensureConfig();

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });

  return parseResponse<{
    access_token: string;
    user: { id: string; email?: string; user_metadata?: Record<string, unknown> };
  }>(response);
}

export async function signUpWithPassword(payload: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}) {
  ensureConfig();

  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      data: {
        full_name: payload.fullName,
        role: payload.role,
      },
    }),
  });

  return parseResponse<{
    access_token?: string;
    user?: { id: string; email?: string; user_metadata?: Record<string, unknown> };
  }>(response);
}

export async function getAuthUser(token: string) {
  ensureConfig();

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: authHeaders(token),
  });

  return parseResponse<{
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }>(response);
}

export async function signOutSession(token: string) {
  ensureConfig();

  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

function mapRestaurant(row: Record<string, unknown>): Restaurant {
  return {
    id: String(row.id),
    name: String(row.name ?? "Unnamed restaurant"),
    address: String(row.address ?? ""),
    city: String(row.city ?? ""),
    cuisine: String(row.cuisine_type ?? "Restaurant"),
    description: String(row.description ?? ""),
    imageUrl: String(
      row.image_url ??
        row.imageUrl ??
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    ),
    rating: typeof row.rating === "number" ? row.rating : null,
    phone: row.phone ? String(row.phone) : null,
    opening_hours: row.opening_hours ? String(row.opening_hours) : null,
    owner_id: row.owner_id ? String(row.owner_id) : undefined,
  };
}

function mapReservation(row: Record<string, unknown>): Reservation {
  const restaurant = row.restaurants as { name?: unknown } | null | undefined;
  const rawStatus = String(row.status ?? "booked");
  const status =
    rawStatus === "cancelled"
      ? "cancelled"
      : rawStatus === "completed"
        ? "completed"
        : "upcoming";

  return {
    id: String(row.id),
    restaurantId: String(row.restaurant_id ?? row.restaurantId ?? ""),
    restaurantName: String(
      restaurant?.name ?? row.restaurant_name ?? row.restaurantName ?? "Restaurant",
    ),
    restaurant_name: restaurant?.name ? String(restaurant.name) : undefined,
    date: String(row.reservation_date ?? row.date ?? ""),
    reservation_date: row.reservation_date ? String(row.reservation_date) : undefined,
    time: String(row.reservation_time ?? row.time ?? ""),
    reservation_time: row.reservation_time ? String(row.reservation_time) : undefined,
    partySize: Number(row.party_size ?? row.partySize ?? 2),
    party_size: Number(row.party_size ?? row.partySize ?? 2),
    status,
  };
}

function mapReview(row: Record<string, unknown>): Review {
  const users = row.users as { full_name?: unknown } | null | undefined;

  return {
    id: String(row.id),
    restaurantId: String(row.restaurant_id ?? row.restaurantId ?? ""),
    restaurant_id: row.restaurant_id ? String(row.restaurant_id) : undefined,
    reviewerName: String(
      users?.full_name ?? row.reviewer_name ?? row.reviewerName ?? "Guest",
    ),
    reviewer_name: users?.full_name
      ? String(users.full_name)
      : row.reviewer_name
        ? String(row.reviewer_name)
        : undefined,
    rating: Number(row.rating ?? 0),
    comment: String(row.comment ?? ""),
    createdAt: String(row.review_date ?? row.created_at ?? row.createdAt ?? ""),
    review_date: row.review_date ? String(row.review_date) : undefined,
  };
}

export async function getAppUserByAuthUserId(authUserId: string, token?: string) {
  const path = `users?select=id,user_id,full_name,role&user_id=eq.${authUserId}&limit=1`;
  const rows = token
    ? await authedRestRequest<Record<string, unknown>[]>(path, token)
    : await restRequest<Record<string, unknown>[]>(path);

  return rows[0] ?? null;
}

export async function getAppProfile(token: string): Promise<AppUserProfile | null> {
  const authUser = await getAuthUser(token);
  let appUser = await getAppUserByAuthUserId(authUser.id, token);

  if (!appUser) {
    const fallbackName = String(
      authUser.user_metadata?.full_name ??
        authUser.email?.split("@")[0] ??
        "Guest User",
    );
    const fallbackRole = authUser.user_metadata?.role === "owner" ? "owner" : "customer";

    try {
      await authedRestRequest<Record<string, unknown>[]>("users", token, {
        method: "POST",
        headers: {
          Prefer: "return=representation,resolution=merge-duplicates",
        },
        body: JSON.stringify([
          {
            user_id: authUser.id,
            full_name: fallbackName,
            role: fallbackRole,
          },
        ]),
      });

      appUser = await getAppUserByAuthUserId(authUser.id, token);
    } catch {
      // If policies block self-provisioning, fall back to auth metadata below.
    }
  }

  if (!appUser) {
    return {
      id: authUser.id,
      user_id: authUser.id,
      full_name: String(
        authUser.user_metadata?.full_name ??
          authUser.email?.split("@")[0] ??
          authUser.email ??
          "Guest User",
      ),
      role: authUser.user_metadata?.role === "owner" ? "owner" : "customer",
      email: authUser.email,
    };
  }

  return {
    id: String(appUser.id ?? authUser.id),
    user_id: String(appUser.user_id ?? authUser.id),
    full_name: String(
      appUser.full_name ?? authUser.user_metadata?.full_name ?? authUser.email ?? "Guest User",
    ),
    role: appUser.role === "owner" ? "owner" : "customer",
    email: authUser.email,
  };
}

export async function getRestaurants() {
  const rows = await restRequest<Record<string, unknown>[]>(
    "restaurants?select=id,owner_id,name,address,city,cuisine_type,description,phone,opening_hours,image_url,rating&order=name.asc",
  );
  return rows.map(mapRestaurant);
}

export async function getOwnerRestaurants(ownerId: string, token: string) {
  const rows = await authedRestRequest<Record<string, unknown>[]>(
    `restaurants?select=id,owner_id,name,address,city,cuisine_type,description,phone,opening_hours,image_url,rating&owner_id=eq.${ownerId}&order=name.asc`,
    token,
  );
  return rows.map(mapRestaurant);
}

export async function getRestaurantById(restaurantId: string) {
  const rows = await restRequest<Record<string, unknown>[]>(
    `restaurants?select=id,owner_id,name,address,city,cuisine_type,description,phone,opening_hours,image_url,rating&id=eq.${restaurantId}&limit=1`,
  );

  if (rows.length > 0) {
    return mapRestaurant(rows[0]);
  }

  return null;
}

export async function getOwnedRestaurantById(
  restaurantId: string,
  ownerId: string,
  token: string,
) {
  const rows = await authedRestRequest<Record<string, unknown>[]>(
    `restaurants?select=id,owner_id,name,address,city,cuisine_type,description,phone,opening_hours,image_url,rating&id=eq.${restaurantId}&owner_id=eq.${ownerId}&limit=1`,
    token,
  );

  if (rows.length > 0) {
    return mapRestaurant(rows[0]);
  }

  return null;
}

export async function createRestaurant(
  restaurant: Partial<Restaurant> & { owner_id: string },
  token: string,
) {
  const rows = await authedRestRequest<Record<string, unknown>[]>("restaurants", token, {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify([
      {
        owner_id: restaurant.owner_id,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city ?? "",
        cuisine_type: restaurant.cuisine_type ?? restaurant.cuisine ?? "",
        description: restaurant.description ?? "",
        phone: restaurant.phone ?? null,
        opening_hours: restaurant.opening_hours ?? null,
        image_url: restaurant.image_url ?? restaurant.imageUrl ?? null,
      },
    ]),
  });

  return rows[0] ? mapRestaurant(rows[0]) : null;
}

export async function updateOwnedRestaurant(
  restaurantId: string,
  ownerId: string,
  restaurant: Partial<Restaurant>,
  token: string,
) {
  const rows = await authedRestRequest<Record<string, unknown>[]>(
    `restaurants?id=eq.${restaurantId}&owner_id=eq.${ownerId}`,
    token,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city ?? "",
        cuisine_type: restaurant.cuisine_type ?? restaurant.cuisine ?? "",
        description: restaurant.description ?? "",
        phone: restaurant.phone ?? null,
        opening_hours: restaurant.opening_hours ?? null,
        image_url: restaurant.image_url ?? restaurant.imageUrl ?? null,
      }),
    },
  );

  return rows[0] ? mapRestaurant(rows[0]) : null;
}

export async function getReviews(restaurantId?: string) {
  const filter = restaurantId ? `&restaurant_id=eq.${restaurantId}` : "";

  const rows = await restRequest<Record<string, unknown>[]>(
    `reviews?select=id,restaurant_id,user_id,reservation_id,rating,comment,review_date,created_at,users!reviews_user_id_fkey(full_name)${filter}&order=review_date.desc`,
  );
  return rows.map(mapReview);
}

export async function getReservations(token?: string) {
  if (!token) {
    return [];
  }

  const user = await getAuthUser(token);
  const appUser = await getAppUserByAuthUserId(user.id, token);

  if (!appUser?.id) {
    return [];
  }

  const rows = await authedRestRequest<Record<string, unknown>[]>(
    `reservations?select=id,user_id,restaurant_id,reservation_date,reservation_time,party_size,status,created_at,restaurants!reservations_restaurant_id_fkey(name)&user_id=eq.${appUser.id}&order=reservation_date.asc`,
    token,
  );
  return rows.map(mapReservation);
}

export async function createReservation(
  payload: {
    restaurantId: string;
    reservationDate: string;
    reservationTime: string;
    partySize: number;
  },
  token: string,
) {
  const appProfile = await getAppProfile(token);

  if (!appProfile?.id) {
    throw new Error("You must be signed in to reserve a table.");
  }

  const rows = await authedRestRequest<Record<string, unknown>[]>("reservations", token, {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify([
      {
        user_id: appProfile.id,
        restaurant_id: payload.restaurantId,
        reservation_date: payload.reservationDate,
        reservation_time: payload.reservationTime,
        party_size: payload.partySize,
        status: "booked",
      },
    ]),
  });

  return rows[0] ? mapReservation(rows[0]) : null;
}

export async function cancelReservation(reservationId: string, token: string) {
  const appProfile = await getAppProfile(token);

  if (!appProfile?.id) {
    throw new Error("You must be signed in to cancel a reservation.");
  }

  const rows = await authedRestRequest<Record<string, unknown>[]>(
    `reservations?id=eq.${reservationId}&user_id=eq.${appProfile.id}`,
    token,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "cancelled",
      }),
    },
  );

  return rows[0] ? mapReservation(rows[0]) : null;
}
