exports.seed = async function(knex) {
    await knex('movies').del()

    const userIds = await knex('users').pluck('id')
    //await knex('movies').insert([
    //{ id: 1, title: 'Spirited Away', directors: 'Hayao Miyazaki', year: 2002, rating: 5, poster_url: 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', user_id: userIds[0] },
    //{ id: 2, title: 'John Wick: Chapter 4', directors: 'Chad Stahelski', year: 2023, rating: 3, poster_url: 'https://assets-prd.ignimgs.com/2023/02/08/jw4-2025x3000-online-character-1sht-keanu-v187-1675886090936.jpg', user_id: userIds[1] },
    //{ id: 3, title: 'McQueen', directors: 'Ian Bonhôte', year: 2018, rating: 3, poster_url: 'https://m.media-amazon.com/images/M/MV5BODdlZjY1MWUtNDAwMy00Y2E4LWFhMzQtMjIxZGM4ZTIyNWMzXkEyXkFqcGdeQXVyNDY2MjcyOTQ@._V1_.jpg', user_id: userIds[2] },
    //{ id: 4, title: 'The Great Gatsby', directors: 'Baz Luhrmann', year: 2013, rating: 1, poster_url: 'https://m.media-amazon.com/images/M/MV5BMTkxNTk1ODcxNl5BMl5BanBnXkFtZTcwMDI1OTMzOQ@@._V1_.jpg', user_id: userIds[1] },
    //{ id: 5, title: 'The Hobbit: The Battle of the Five Armies', directors: 'Peter Jackson', year: 2014, rating: 2, poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYzNDE3OTQ3MF5BMl5BanBnXkFtZTgwODczMTg4MjE@._V1_.jpg', user_id: userIds[2] },
    //{ id: 6, title: 'No Time to Die', directors: 'Cary Joji Fukunaga', year: 2021, rating: 5, poster_url: 'https://m.media-amazon.com/images/M/MV5BYWQ2NzQ1NjktMzNkNS00MGY1LTgwMmMtYTllYTI5YzNmMmE0XkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg', user_id: userIds[1] },
    //{ id: 7, title: 'Godzilla vs. Kong', directors: 'Adam Wingard', year: 2021, rating: 3, poster_url: 'https://m.media-amazon.com/images/M/MV5BMzk2ZmYxNTUtODlhMi00NzE2LTkwMTctYjg0ODQ1ZjkyNzJmXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg', user_id: userIds[2] },
    //{ id: 8, title: 'Akira', directors: 'Katsuhiro Otomo', year: 1988, rating: 1, poster_url: 'https://m.media-amazon.com/images/M/MV5BNjFmNWYzZjMtYWIyZi00NDVmLWIxY2EtN2RiMjZiMDk4MzcyXkEyXkFqcGdeQXVyMTg2NjYzOA@@._V1_FMjpg_UX1000_.jpg', user_id: userIds[0] },
    //{ id: 9, title: 'Fantastic Beasts: The Secrets of Dumbledore', directors: 'David Yates', year: 2022, rating: 3, poster_url: 'https://m.media-amazon.com/images/M/MV5BZGQ1NjQyNDMtNzFlZS00ZGIzLTliMWUtNGJkMGMzNTBjNDg0XkEyXkFqcGdeQXVyMTE1NDI5MDQx._V1_FMjpg_UX1000_.jpg', user_id: userIds[1] },
    //{ id: 10, title: 'Demon Slayer: Kimetsu no Yaiba Swordsmith Village Arc', directors: 'Haruo Sotozaki', year: 2023, rating: 5, poster_url: 'https://m.media-amazon.com/images/M/MV5BZDZiZTZhMzgtYTY0ZC00OGUyLWE2NzgtMmM4MjA1YjUxN2YyXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_FMjpg_UX1000_.jpg', user_id: userIds[0] }
//])
}
