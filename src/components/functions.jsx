import axios from "axios";
import { CheckCheck } from "lucide-react";
export const getInitials = (name) => {
  if (!name) return "?";
  return name[0].toUpperCase();
};

export const getAvatarColor = (name) => {
  if (!name) return "bg-gray-400";
  const colors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
export const formatMessageText = (text) => {
  // Handle bold text
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Handle italic text
  formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Handle links
  formattedText = formattedText.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 underline">$1</a>'
  );

  return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

// export const callGeminiAPI = async (prompt) => {
//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
//         import.meta.env.VITE_GEMINI_API_KEY
//       }`,
//       { contents: [{ parts: [{ text: prompt }] }] },
//       { headers: { "Content-Type": "application/json" } }
//     );
//     if (
//       response.data &&
//       response.data.candidates &&
//       response.data.candidates[0] &&
//       response.data.candidates[0].content &&
//       response.data.candidates[0].content.parts
//     ) {
//       return response.data.candidates[0].content.parts[0].text.trim();
//     }
//     return null;
//   } catch (error) {
//     console.error("Gemini API error:", error.response?.data || error.message);
//     return null;
//   }
// };

export const Avatar = ({ name, src, size = "md", className }) => {
  const sizeClasses = {
    lg: "w-8 h-8 text-base",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} ${className} rounded-full`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${getAvatarColor(
        name
      )} ${className} rounded-full flex items-center justify-center text-white font-medium`}
    >
      {getInitials(name)}
    </div>
  );
};
export const MessageStatus = ({ status }) => {
  if (status === "sent") {
    return <span className="text-gray-400">✓</span>;
  } else if (status === "delivered") {
    return <span className="text-gray-400">✓✓</span>;
  } else if (status === "read") {
    return <CheckCheck size={16} className="text-blue-500" />;
  }
  return null;
};

export const formatAiText = (text) => {
  if (!text) return null;

  // Split text into lines and process each line
  const lines = text.split("\n");
  const elements = [];
  let currentList = [];
  let inBlockquote = false;

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();

    // Handle empty lines
    if (!trimmedLine) {
      if (currentList.length > 0) {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="list-disc list-inside ml-4 my-2 space-y-1"
          >
            {currentList.map((item, i) => (
              <li key={i} className="text-sm">
                {processInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
      elements.push(<br key={`br-${lineIndex}`} />);
      return;
    }

    // Handle list items
    if (trimmedLine.match(/^[\*\-\+]\s+/)) {
      const listItem = trimmedLine.replace(/^[\*\-\+]\s+/, "");
      currentList.push(listItem);
      return;
    }

    // If we were building a list but this line isn't a list item, add the list
    if (currentList.length > 0) {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          className="list-disc list-inside ml-4 my-2 space-y-1"
        >
          {currentList.map((item, i) => (
            <li key={i} className="text-sm">
              {processInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }

    // Handle blockquotes
    if (trimmedLine.startsWith(">")) {
      const quoteText = trimmedLine.replace(/^>\s*/, "");
      elements.push(
        <div
          key={`quote-${lineIndex}`}
          className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600"
        >
          {processInlineFormatting(quoteText)}
        </div>
      );
      return;
    }

    // Handle regular text
    elements.push(
      <p key={`p-${lineIndex}`} className="my-1">
        {processInlineFormatting(trimmedLine)}
      </p>
    );
  });

  // Handle any remaining list items
  if (currentList.length > 0) {
    elements.push(
      <ul
        key={`list-${elements.length}`}
        className="list-disc list-inside ml-4 my-2 space-y-1"
      >
        {currentList.map((item, i) => (
          <li key={i} className="text-sm">
            {processInlineFormatting(item)}
          </li>
        ))}
      </ul>
    );
  }

  return <div className="text-sm leading-relaxed">{elements}</div>;
};
const processInlineFormatting = (text) => {
  const parts = [];
  let currentIndex = 0;

  // Regex patterns for different formatting
  const patterns = [
    {
      regex: /\*\*\*(.*?)\*\*\*/g,
      component: (text, key) => (
        <strong key={key} className="font-bold italic">
          {text}
        </strong>
      ),
    },
    {
      regex: /\*\*(.*?)\*\*/g,
      component: (text, key) => (
        <strong key={key} className="font-bold">
          {text}
        </strong>
      ),
    },
    {
      regex: /\*(.*?)\*/g,
      component: (text, key) => (
        <em key={key} className="italic">
          {text}
        </em>
      ),
    },
    {
      regex: /`(.*?)`/g,
      component: (text, key) => (
        <code
          key={key}
          className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono"
        >
          {text}
        </code>
      ),
    },
  ];

  let workingText = text;
  let replacements = [];

  // Find all matches and their positions
  patterns.forEach((pattern, patternIndex) => {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = regex.exec(text)) !== null) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        component: pattern.component(
          match[1],
          `${patternIndex}-${match.index}`
        ),
        priority: patternIndex,
      });
    }
  });

  // Sort by position and priority
  replacements.sort((a, b) => a.start - b.start || a.priority - b.priority);

  // Remove overlapping matches (keep higher priority ones)
  const cleanReplacements = [];
  replacements.forEach((replacement) => {
    const overlaps = cleanReplacements.some(
      (existing) =>
        (replacement.start >= existing.start &&
          replacement.start < existing.end) ||
        (replacement.end > existing.start && replacement.end <= existing.end)
    );
    if (!overlaps) {
      cleanReplacements.push(replacement);
    }
  });

  // Build the final result
  if (cleanReplacements.length === 0) {
    return text;
  }

  let lastEnd = 0;
  cleanReplacements.forEach((replacement, index) => {
    // Add text before this replacement
    if (replacement.start > lastEnd) {
      parts.push(text.substring(lastEnd, replacement.start));
    }
    // Add the replacement component
    parts.push(replacement.component);
    lastEnd = replacement.end;
  });

  // Add remaining text
  if (lastEnd < text.length) {
    parts.push(text.substring(lastEnd));
  }

  return parts;
};
