import { WagerUser } from "@/types/Wagers";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { FC } from "react";

interface Props {
  users: WagerUser[];
}

const LeaderboardTable: FC<Props> = ({ users }) => {
  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number
  ) {
    return { name, calories, fat, carbs };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24),
    createData("Ice cream sandwich", 237, 9.0, 37),
    createData("Eclair", 262, 16.0, 24),
    createData("Cupcake", 305, 3.7, 67),
    createData("Gingerbread", 356, 16.0, 49),
  ];

  return (
    <div className="w-full mb-20">
      <TableContainer sx={{ fontFamily: "pixel" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow className="bg-transparent h-fit">
              <TableCell />
              <TableCell align="right">DPP</TableCell>
              <TableCell align="right">Streak</TableCell>
              <TableCell align="right">Win %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.publicKey}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: "white",
                }}
              >
                <TableCell component="th" scope="row">
                  {row.publicKey}
                </TableCell>
                <TableCell align="right">{row.stats?.totalPoints ?? 0}</TableCell>
                <TableCell align="right">{row.stats?.winStreak ?? 0}</TableCell>
                <TableCell align="right">{Math.floor(row.stats?.totalWins ?? 0 / row.stats?.totalGamesPlayed ?? 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LeaderboardTable;
