/**
 * Nothing, which is what the modal slot shows almost always.
 *
 * Required: without it, a hard navigation to any route that this slot does
 * not match renders a 404 for the whole page rather than simply leaving the
 * overlay empty. That is every page on the site.
 */
export default function Default() {
  return null;
}
