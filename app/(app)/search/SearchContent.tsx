"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/lib/(apiCalls)/useApi";
import { searchCall } from "@/lib/(apiCalls)/search/searchCall";
import UserList from "@/components/user-list";
import { User } from "@/lib/stores/auth-store";
import { Post } from "@/lib/social-data";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { execute } = useApi();

  useEffect(() => {
    let isActive = true;

    if (!query.trim()) {
      setUsers([]);
      setPosts([]);
      setLoading(false);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await execute(() => searchCall(query));

        if (!isActive) return;

        if (response.error) {
          throw new Error(response.message ?? "Search failed");
        }

        setUsers(Array.isArray(response.users) ? response.users : []);

        setPosts(Array.isArray(response.posts) ? response.posts : []);
      } catch (error) {
        console.error("SEARCH ERROR:", error);

        if (!isActive) return;

        setError(true);
        setUsers([]);
        setPosts([]);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    search();

    return () => {
      isActive = false;
    };
  }, [query]);

  const hasResults = users.length > 0 || posts.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p>Searching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-10">
        <p>Something went wrong while searching.</p>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <h2 className="text-lg font-semibold">No results found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find anything matching "{query}".
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 p-4">
      {/* Search Heading */}
      <header>
        <h1 className="text-xl font-semibold">Search results for "{query}"</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {users.length} people · {posts.length} posts found
        </p>
      </header>

      {/* Users Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">People</h2>
          <span className="text-sm text-muted-foreground">
            {users.length} results
          </span>
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No people found.</p>
        ) : (
          <div className="space-y-3">
            <UserList users={users}></UserList>
          </div>
        )}
      </section>

      {/* Posts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Posts</h2>
          <span className="text-sm text-muted-foreground">
            {posts.length} results
          </span>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts found.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="space-y-3 rounded-lg border p-4"
              >
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                    {post.author.profile_pic_url && (
                      <img
                        src={post.author.profile_pic_url}
                        alt={post.author.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      @{post.author.handle}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="whitespace-pre-wrap text-sm">{post.body}</p>

                {/* Post Images */}
                {post.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {post.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt="Post image"
                        className="h-48 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}

                {/* Post Metadata */}
                <div className="flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
