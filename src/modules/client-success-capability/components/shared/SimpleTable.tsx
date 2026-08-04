import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/design-os/components/Table";

export function SimpleTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row, i) => (
                    <TableRow key={i}>
                        {row.map((cell, j) => (
                            <TableCell key={j}>{cell}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
