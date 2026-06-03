"use client";

import { useEffect, useState } from "react";

export type User = {
	id: number;
	first_name: string;
	last_name: string;
	rating: string;
	atc_active: boolean;
	endorsements?: {
		facility?: Array<{
			rating: string;
			valid_from: string;
			valid_to: string | null;
		}> | null;
	};
};

type UsersResponse = User[] | { data: User[] } | Array<{ data: User[] }>;

function normaliseUsers(payload: UsersResponse): User[] {
	if (Array.isArray(payload)) {
		if (payload.length > 0 && "data" in payload[0]) {
			return payload[0].data;
		}

		return payload as User[];
	}

	return payload.data;
}

export function useUsers() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isActive = true;

		async function loadUsers() {
			try {
				setIsLoading(true);
				setError(null);

				const response = await fetch("/api/data/roster", {
					cache: "no-store",
				});

				if (!response.ok) {
					const message = await response.text();

					throw new Error(message || "Failed to fetch users.");
				}

				const payload = (await response.json()) as UsersResponse;

				if (!isActive) {
					return;
				}

				setUsers(normaliseUsers(payload));
			} catch (caughtError) {
				if (!isActive) {
					return;
				}

				setError(
					caughtError instanceof Error
						? caughtError.message
						: "Failed to fetch users.",
				);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		}

		loadUsers();

		return () => {
			isActive = false;
		};
	}, []);

	return {
		users,
		isLoading,
		error,
	};
}

export default useUsers;
