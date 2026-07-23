// each foreignKeys entry looks like "orders.user_id -> users.id" — meaning
// the table before the first dot (orders) depends on the table after the arrow (users).
// this function decides what order tables must be restored in, so a table is
// never restored before the tables its foreign keys point at.
export function topologicalSortTables(tables: string[], foreignKeys: string[]): string[] {
    const inDegree: Record<string, number> = {};
    const adjacency: Record<string, string[]> = {};

    for (const table of tables) {
        inDegree[table] = 0;
        adjacency[table] = [];
    }

    for (const fk of foreignKeys) {
        const [left, right] = fk.split(' -> ');
        const dependentTable = left.split('.')[0];
        const prerequisiteTable = right.split('.')[0];

        // skip FKs pointing at tables we don't know about (shouldn't normally happen,
        // but guards against a malformed/partial metadata.json).
        if (!(dependentTable in inDegree) || !(prerequisiteTable in inDegree)) {
            continue;
        }

        adjacency[prerequisiteTable].push(dependentTable);
        inDegree[dependentTable] += 1;
    }

    // Kahn's algorithm for topological sorting 

    const queue: string[] = tables.filter((table) => inDegree[table] === 0);
    const order: string[] = [];

    while (queue.length > 0) {
        const current = queue.shift() as string;
        order.push(current);

        for (const dependent of adjacency[current]) {
            inDegree[dependent] -= 1;
            if (inDegree[dependent] === 0) {
                queue.push(dependent);
            }
        }
    }
    

    if (order.length < tables.length) {
        throw new Error('Cannot determine restore order: circular foreign key dependency detected');
    }

    return order;
}
