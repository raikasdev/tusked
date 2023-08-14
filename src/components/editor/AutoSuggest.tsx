import { useEffect, useState } from 'preact/hooks';

export interface AutoSuggestOption {
  imageUrl?: string; // Profile picture
  title: string; // Main text (hashtag, display name)
  info?: string; // Grayed out extra information (@account, users per week...)
}
interface AutoSuggestProps {
  options: AutoSuggestOption[];
}
export default function AutoSuggest({ options }: AutoSuggestProps) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [options]);

  if (options.length === 0) return <></>;

  return (
    <div className="autosuggest-wrapper">
      <div className="autosuggest">
        {options.map((option, index) => (
          <div
            className={`autosuggest-item${index === selected ? ' active' : ''}`}
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
  );
}
