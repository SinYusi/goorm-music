"use client";
import { Playlist } from "@/domains/playlist/types/Playlist";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [listData, setListData] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/playlist/getPlaylist");
      const data = await res.json();
      setListData(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>나의 플레이리스트</h1>
      <div className="flex flex-col gap-4">
        {listData.map((playlist) => (
          <Link href={`/playlist/${playlist.id}`} key={playlist.id}>
            <div className="flex gap-4 p-2 rounded border border-(--gray) cursor-pointer hover:bg-(--primary-blue-hover)">
              <Image
                src={playlist.images?.[0]?.url || "/goorm_logo_blue.png"}
                alt={playlist.name}
                width={100}
                height={100}
                className="rounded"
              />
              <div className="place-content-center">
                <h3>{playlist.name}</h3>
                <p>{playlist.tracks.total} 곡</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
