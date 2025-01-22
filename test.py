hashtags = []
add_hashtag = False
temp_hashtag_word = ""
text = "fdsf #this f"

for char in text:
    if char == "#":
        add_hashtag = True
    elif add_hashtag and char == " ":
        hashtags.append(temp_hashtag_word)
        temp_hashtag_word = ""
        add_hashtag = False
        
    if add_hashtag:
        temp_hashtag_word += char

if temp_hashtag_word:
    hashtags.append(temp_hashtag_word)

print(hashtags)