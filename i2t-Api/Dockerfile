# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install Tesseract & Leptonica
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    && rm -rf /var/lib/apt/lists/*

# Create symlink so Tesseract.NET finds it
RUN ln -s /usr/lib/x86_64-linux-gnu/liblept.so.5 /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so

# Copy app
COPY --from=build /app/publish .

# Make sure tessdata is included
COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
