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

# Discover actual liblept file and symlink it for .NET binding
RUN lept_lib=$(ldconfig -p | grep liblept.so | head -n1 | awk '{print $4}') \
    && echo "Found $lept_lib" \
    && ln -sf $lept_lib /usr/lib/libleptonica-1.82.0.so \
    && ln -sf $lept_lib /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so \
    && ls -l /usr/lib* | grep libleptonica || true

# Copy published app
COPY --from=build /app/publish .

# Copy tessdata (OCR models)
COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Copy Hunspell dictionaries
COPY i2t-Api/Dictionaries /usr/share/hunspell

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
