const validateSQL = (sql) => {
    const forbidden = [
        'DELETE',
        'UPDATE',
        'INSERT',
        'DROP',
        'ALTER',
        'TRUNCATE',
        'EXEC',
        'CREATE'
    ];

    const upper = sql.toUpperCase();

    const hasForbidden = forbidden.some(word => upper.includes(word));

    if (hasForbidden) {
        throw new Error('Unsafe SQL detected');
    }
    if (!upper.includes('SELECT')) {
        throw new Error('Only SELECT queries allowed');
    }
    return true;
}

module.exports = {
    validateSQL
};