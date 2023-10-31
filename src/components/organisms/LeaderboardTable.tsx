import { WagerUser } from "@/types/Wagers";
import Image from "next/image";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { FC, useState } from "react";
import FallbackImage from "../atoms/FallbackImage";
import { InfoIcon, InfoModal } from "@/components";

interface Props {
  users: WagerUser[];
}

const LeaderboardTable: FC<Props> = ({ users }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const getTrophy = (place: number) => {
    switch (place) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="w-full mb-20">
        <TableContainer sx={{ fontFamily: "pixel" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className="bg-transparent h-fit">
                <TableCell align="right" />
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-2">
                    DPP™
                    <InfoIcon
                      className="w-4 h-4 fill-purple1 hover:fill-purple2 cursor-pointer"
                      onClick={() => setShowInfoModal(true)}
                    />
                  </div>
                </TableCell>
                <TableCell align="right">Streak</TableCell>
                <TableCell align="right" sx={{ paddingRight: "32px" }}>
                  Win %
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, 10).map((row, index) => {
                if (!row.stats) return null;
                return (
                  <TableRow
                    key={row.publicKey}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      backgroundColor: "white",
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ paddingLeft: "32px" }}
                    >
                      <div className="flex items-center gap-5">
                        <p className="w-5 text-lg flex items-center justify-center">
                          {index + 1 > 3 ? index + 1 : getTrophy(index + 1)}
                        </p>
                        {row.twitterData ? (
                          <a
                            href={`https://twitter.com/${row.twitterData.username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2.5"
                          >
                            <div className="rounded-full w-[40px] h-[40px] overflow-hidden">
                              <FallbackImage
                                src={row.twitterData.profileImage}
                                fallbackSrc={"/images/icons/user-alt.png"}
                                width={40}
                                height={40}
                                alt="user image"
                              />
                            </div>
                            <div className="flex flex-col gap-2.5">
                              <p className="text-lg leading-4">
                                {row.twitterData.username}
                              </p>
                              <p className="text-greyscale4 leading-4">
                                {row.stats.totalGamesPlayed} games
                              </p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <Image
                              src="/images/icons/user-alt.png"
                              width={40}
                              height={40}
                              alt="user image"
                              className="rounded-full overflow-hidden"
                            />
                            <div className="flex flex-col gap-2.5">
                              <p className="text-lg leading-4">
                                {row.publicKey.slice(0, 4) +
                                  "..." +
                                  row.publicKey.slice(-4)}
                              </p>
                              <p className="text-greyscale4 leading-4">
                                {row.stats.totalGamesPlayed} games
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <p className="text-lg">
                        {row.stats?.totalPoints ?? 0} pts
                      </p>
                    </TableCell>
                    <TableCell align="right">
                      <p className="text-lg">{row.stats?.winStreak ?? 0}</p>
                    </TableCell>
                    <TableCell align="right" sx={{ paddingRight: "32px" }}>
                      <p className="text-lg">
                        {Math.floor(
                          (row.stats?.totalWins > 0
                            ? row.stats?.totalWins / row.stats?.totalGamesPlayed
                            : 0) * 1000
                        ) / 10}
                        %
                      </p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <InfoModal showModal={showInfoModal} setShowModal={setShowInfoModal}>
        <div
          className="w-full pt-4 text-center gap-5
          flex flex-col items-center justify-center"
        >
          <p className="text-xl sm:text-2xl font-base-b text-center">
            Your potential payout
          </p>
          <p className="max-w-[400px] mx-auto text-base sm:text-lg">
            Your payout is determined by the multiplier. Multipliers are highly
            volatile when the pool is live, and lock when the pool closes.
          </p>
          <button
            className="ml-auto text-purple1 hover:text-purple2 text-lg"
            onClick={() => setShowInfoModal(false)}
          >
            Close
          </button>
        </div>
      </InfoModal>
    </>
  );
};

export default LeaderboardTable;
