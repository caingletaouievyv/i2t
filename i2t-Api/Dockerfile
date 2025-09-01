# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install Tesseract + dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Debug: list what we actually have
RUN ls -l /usr/lib/x86_64-linux-gnu | grep lept || true

# Create symlink for .NET binding (pointing to the real file)
RUN realpath /usr/lib/x86_64-linux-gnu/liblept.so.5 \
    && ln -s $(realpath /usr/lib/x86_64-linux-gnu/liblept.so.5) \
       /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so || true

# Copy published app
COPY --from=build /app/publish .

# Copy tessdata (OCR models)
COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Copy Hunspell dictionaries
COPY i2t-Api/Dictionaries /usr/share/hunspell

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
