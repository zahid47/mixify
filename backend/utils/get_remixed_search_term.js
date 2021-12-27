//copied from https://github.com/alexgurr/mixmello/blob/main/src/pages/Main/api/utils/getRemixSearchTerm.js

export const get_remixed_search_term = (track_name, artist_name) => {
	const normalisedTrack = track_name
		.toLowerCase()
		.replace(
			/\(.*\)|-.*|from (.)+ soundtrack|radio edit|feat.+|ft.+|remix|remixed|’|'/g,
			""
		)
		.trim()
		.replace(/ {2}/g, " ");

	return `${normalisedTrack}${
		artist_name ? ` ${artist_name.toLowerCase()}` : ""
	} remix}`;
};

export default get_remixed_search_term;
