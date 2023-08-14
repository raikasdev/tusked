export interface AutoSuggestOption {
  imageUrl?: string; // Profile picture
  title: string; // Main text (hashtag, display name)
  info?: string; // Grayed out extra information (@account, users per week...)
}
interface AutoSuggestProps {
  options: AutoSuggestOption[];
  submit: (value: string) => void;
}

// Could not get this working :(
// Decided to move on to other features - Raikas, 14.8.2023
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AutoSuggest(_props: AutoSuggestProps) {
  //const [selectedIndex, setSelectedIndex] = useState(0);

  return <></>;

  /*return (
    <div className="autosuggest-wrapper">
      <div className="autosuggest">
        {options.map((option, index) => (
          <div
            className={`autosuggest-item${
              index === selectedIndex ? ' active' : ''
            }`}
          >
            {option.imageUrl && (
              <div className="item-image">
                <img src={option.imageUrl} loading="lazy" />
              </div>
            )}
            <p className="item-title">
              {option.title}
              {option.info && <span className="item-info">{option.info}</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );*/
}
