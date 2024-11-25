export default function SortButtons(props) {
  return (
    <div id="button-container">
      <button id="newest-filter-button" onClick={() => {
        props.onSortChange('newest');
        props.setLoading(true);
      }}>
        Newest
      </button>
      <button id="oldest-filter-button" onClick={() => {
        props.onSortChange('oldest');
        props.setLoading(true);
      }}>
        Oldest
      </button>
      <button id="active-filter-button" onClick={() => {
        props.onSortChange('active');
        props.setLoading(true);
      }}>
        Active
      </button>
    </div>
  );
}
