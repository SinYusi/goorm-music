"use client";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Playlist } from "../types/Playlist";
import LoadingSpinner from "@/domains/common/components/LoadingSpinner";
import { userSpotifyStore } from "@/domains/common/stores/userSpotifyStore";

type Props = {
  playlists: Playlist[];
  setPlaylists: Dispatch<SetStateAction<Playlist[]>>;
  track: string;
};
export default function PlayList({ playlists, setPlaylists, track }: Props) {
  const { userId } = userSpotifyStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchPlaylists = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/playlist/getPlaylist");
        const data = await res.json();
        setPlaylists(data);
      } catch (error) {
        console.error("플레이리스트 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [setPlaylists, userId]);

  const handleAddPlayList = async (playlistId: string) => {
    const res = await fetch(`/api/playlist/getPlaylistDetail?id=${playlistId}`);
    const detailData = await res.json();

    const alreadyExists = detailData.tracks.items.some(
      (item: { track: { uri: string } }) => item.track.uri === track
    );
    if (alreadyExists) {
      alert("이미 해당 플레이리스트에 존재하는 곡입니다.");
      return;
    }

    try {
      setIsLoading(true);
      await fetch("/api/playlist/addTrack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId, track }),
      });

      //TODO : 신규 트랙 추가 후 플리 track 수 업데이트 미반영 오류
      const res = await fetch("/api/playlist/getPlaylist");
      const data = await res.json();
      setPlaylists(data);
    } catch (err) {
      console.log("플리 추가 오류 ", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-4">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="flex gap-4 p-2 rounded border border-(--gray) cursor-pointer hover:bg-(--primary-blue-hover)"
          onClick={() => handleAddPlayList(playlist.id)}
        >
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
      ))}
    </div>
  );
}
